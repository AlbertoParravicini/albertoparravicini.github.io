// Coordinate system used inside the svg viewBox;
var heightSvg = 200
var widthSvg = 200
var graphZoomFactor = 1.4
var radiusSize = 5

// Maximum distance to display from the current vertex;
var maxDistance = 3

// Opacity attributes;
const minOpacity = 0.000001
const defaultOpacity = 0.6

// Repel force between vertices. Increase it to make vertices further apart (keep it < 0);
var repelForce = -50

// TODO: If true, treat the graph as undirected;
var undirect = false

// Set size of viewbox to fill the screen;
const graphDiv = d3.select("#graph-viz-main")
const parentGraphDiv = document.getElementById('graph-viz-main').parentElement
const svg = graphDiv.append("svg")
    .attr("width", "100%")
    .attr("height", heightSvg * graphZoomFactor)
    .attr("viewBox", [0, 0, widthSvg, heightSvg])

/////////////////////////////
/////////////////////////////

// Set only some of the vertices to be visible, at the start;
function initializeVisibleGraph(graph) {
    const visibleVertices = [0, 3] // Replace it with a random selection;
    return createGraphSubset(graph, visibleVertices)
}

function createGraphSubset(graph, visibleVertices) {
    // Set only the first vertex to be visible;
    selectedVertices = graph.bfs(visibleVertices.map(id => graph.vertex(id)), maxDistance, true)

    // Collect the list of visible edges from the selected vertices;
    var selectedEdges = []
    selectedVertices.forEach(v => selectedEdges.push(...v.edges.filter(e => e.selected == true)))

    return [selectedVertices, selectedEdges]
}

/////////////////////////////
/////////////////////////////

// Define parameters and functions related to the graph visualization;

const numColors = maxDistance
const colorRange = d3.scaleLinear()
    .domain([0, numColors])
    .range([0.8, 0.2])
var graphColor = (d) => {
    if (d.distance < maxDistance) {
        return d3.interpolateReds(colorRange(d.distance))
    } else return "#bbb"
}

var lineStyle = (d) => {
    if (d.targetDistance >= maxDistance) {
        return "1, 3"
    } else "null"
}

// Enable exploring the graph by clicking on vertices.
// Note that "graph" is not strictly required, we can assume for example
//   that this function will send a request to a server and get some new vertices and edges from it;
function exploreOnClick(v, graph) {

    // Obtain a new graph subset;
    var [newVertices, newEdges] = createGraphSubset(graph, [v.id])

    updateGraph(newVertices, newEdges, graph)
}

var defaultVertexStyle = (vertex, opacity) => vertex
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("r", radiusSize)
    .attr("fill", d => graphColor(d))
    .attr("opacity", opacity != undefined ? opacity : defaultOpacity)

var defaultEdgeStyle = (edge, opacity) => edge
    .attr("stroke", "#000")
    .attr("stroke-opacity", opacity != undefined ? opacity : defaultOpacity)
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", d => lineStyle(d))


/////////////////////////////
/////////////////////////////

// Initial graph drawing;
var initializeGraph = data => {

    var graph = new Graph(data)

    // Initialize visible portion of the graph;
    var [vertices, edges] = initializeVisibleGraph(graph)

    var simulation = createSimulation(vertices, edges)

    const edge = svg
        .selectAll("line")
        .data(edges, d => d.id)
        .join("line")
        .call(defaultEdgeStyle)

    const vertex = svg
        .selectAll("circle")
        .data(vertices, d => d.id)
        .join("circle")
        .call(defaultVertexStyle)
        .call(drag(simulation))
        .on("click", d => exploreOnClick(d, graph))

    vertex.append("title").text(d => `${d.id} - ${d.name}`)

    defineSimulationTick(simulation, vertex, edge)
}

// Function used to update the graph drawing given new vertices and edges to display;
var updateGraph = (vertices, edges, graph) => {

    const durationEnter = svg.transition().duration(1000)
    const durationExit = svg.transition().duration(500)

    // Set a delay on the animation so that elements further away appear later;
    const transitionDelay = (distance) => (distance != undefined && distance >= 0) ? distance * 200 : 0

    var simulation = createSimulation(vertices, edges)

    var edge = svg.selectAll("line")
        .data(edges, d => d.id)
        .join(
            enter => enter.append("line") // Draw a new edge and make it appear;
                .call(defaultEdgeStyle, minOpacity)
                .call(enter => enter.transition(durationEnter)
                    .styleTween("stroke-opacity", () => d3.interpolate(minOpacity, defaultOpacity))
                    .delay(d => transitionDelay(d.targetDistance))),
            update => update // Update the edge style;
                .attr("stroke-dasharray", d => lineStyle(d)),
            exit => exit // Make the edge disappear;
                .call(exit => exit.transition(durationExit)
                    .attr("stroke-opacity", minOpacity).remove())
        )

    var vertex = svg.selectAll("circle")
        .data(vertices, d => d.id)
        .join(
            enter => enter.append("circle") // Draw a new circle and make it appear. Also define simulation and behavior on click;
                .call(defaultVertexStyle, minOpacity)
                .call(enter => enter.transition(durationEnter)
                    .styleTween("opacity", () => d3.interpolate(minOpacity, defaultOpacity))
                    .delay(d => transitionDelay(d.distance)))
                .call(drag(simulation))
                .on("click", d => exploreOnClick(d, graph)),
            update => update // Transition to the new color;
                .call(update => update.transition(durationEnter)
                    .attr("fill", d => graphColor(d))
                    .delay(d => transitionDelay(d.distance))),
            exit => exit // Make the vertex disappear;
                .call(exit => exit.transition(durationExit)
                    .attr("opacity", minOpacity).remove())
        )

    vertex.append("title").text(d => `${d.id} - ${d.name}`)

    defineSimulationTick(simulation, vertex, edge)
}

/////////////////////////////
/////////////////////////////

// Graph simulation, taken as-it-is from https://observablehq.com/@d3/force-directed-graph

var createSimulation = (vertices, edges) => {
    // Define the simulation. 
    // IMPORTANT NOTE: edges/links are expected to have a "source" and "target" fields,
    //   which are references to their vertices, as defined in the array "vertices".
    // This makes the graph data-structure less flexible, unfortunately;
    const simulation = d3.forceSimulation(vertices)
        .force("link", d3.forceLink(edges).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(repelForce))
        .force("center", d3.forceCenter(heightSvg / 2, widthSvg / 2))
    return simulation
}

var defineSimulationTick = (simulation, vertex, edge) => {
    simulation.on("tick", () => {
        edge
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        vertex
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    })
}

var drag = simulation => {

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
    }

    function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
}

/////////////////////////////
/////////////////////////////

// Start the visualization after loading the entire dataset;
d3.json("../resources/data/graph_small.json").then(initializeGraph)

// An utility function to test BFS;
function testBfs(graph) {
    for (var i = 0; i <= 8; i++) {
        selectedVertices = graph.bfs([graph.vertex(i)], maxDistance, true)
        console.log("\ntest bfs with " + i)
        selectedVertices.forEach(v => {
            console.log("id=" + v.id + " distance=" + v.distance)
            v.edges.filter(e => e.selected == true).forEach(e => {
                console.log("\tid=" + e.id + " s=" + e.source.id + " t=" + e.target.id + " selected=" + e.selected + " targetDistance=" + e.targetDistance)
            })
        })
        selectedVertices.forEach(v => v.distance = undefined)
    }
}