class Vertex {
    edges: Array<Edge>
    // Utility attributes used inside algorithms;
    distance: number

    constructor(public id: number, public name?: string) { }
}

class Edge {

    // Utility attributes used inside algorithms;
    targetDistance: number
    selected: boolean = false

    constructor(public id: number, public source: Vertex, public target: Vertex) { }
}

class Graph {

    vertices: Array<Vertex>
    edges: Array<Edge>
    N: number
    E: number
    vertexMap: Map<number, Vertex>

    constructor(data) {
        this.vertices = data.vertices.map(d => Object.create(d))
        this.edges = data.edges.map(d => Object.create(d))
        this.N = this.vertices.length
        this.E = this.edges.length

        // Give to each vertex name a unique numeric ID;
        let idMap = new Map()
        this.vertices.map((v, i) => idMap.set(v.id, i))

        // Replace vertex string IDs with the new numeric ID;
        this.vertices.forEach(v => {
            v.name = v.id.toString()
            v.id = idMap.get(v.name)
        })

        // Build a hashmap to retrieve easily a vertex from its ID;
        this.vertexMap = createVerticesMap(this.vertices)

        // Update edges IDs. Store vertex references in each edge, instead of just their ID;
        this.edges = data.edges.map(d => Object.create(d)).map((e, i) => 
            new Edge(i, this.vertexMap.get(idMap.get(e.source)), this.vertexMap.get(idMap.get(e.target)))
        )

        // Store the edges of each vertex inside the vertex.
        // TODO: undirect
        storeEdges(this.vertexMap, this.edges)
    }

    vertex(id: number) { return this.vertexMap.get(id) }

    neighbours(id: number) { return this.vertexMap.get(id).edges }

    // Sources must be vertices of the graph, and maxDistance must be >= 0.
    // "skipLastFrontierEdges" is used to avoid selecting edges between vertices with maximum allowed distance;
    bfs(sources: Array<Vertex>, maxDistance: number, skipLastFrontierEdges: boolean) {
        let queue = sources
        let selected = []
        // Initialize distance in all sources (distance is undefined in vertices never inspected);
        queue.forEach(s => s.distance = 0)
        // Keep a set of vertices that have been already seen;
        let seenVertices = new Set()
        queue.forEach(s => seenVertices.add(s.id))

        while (queue.length > 0) {
            let current = queue.shift()
            let currDistance: number = current.distance
            selected.push(current)
            current.edges.forEach(e => {
                let neighbour = this.vertexMap.get(e.target.id)
                // Mark this edge as selected;
                if (!skipLastFrontierEdges || currDistance < maxDistance) {
                    e.selected = true
                } else {
                    e.selected = false
                }
                // Select the new neighbour only if it hasn't been seen before, and the current distance is below the threshold;
                if (!seenVertices.has(neighbour.id)) {
                    e.targetDistance = currDistance + 1
                    if (maxDistance != undefined && currDistance + 1 <= maxDistance) {
                        neighbour.distance = currDistance + 1
                        queue.push(neighbour)
                        seenVertices.add(neighbour.id)
                    }
                } else {
                    e.targetDistance = neighbour.distance
                }
            })
        }
        return selected
    }
}

// Build a hashmap to retrieve easily a vertex from its ID;
function createVerticesMap(vertices: Array<Vertex>) {
    let vertexMap = new Map()
    vertices.forEach(v => vertexMap.set(v.id, v))
    return vertexMap
}

// Store the edges of each vertex inside the vertex;
function storeEdges(vertexMap: Map<number, Vertex>, edges: Array<Edge>) {
    vertexMap.forEach((v, _) => v.edges = [])
    edges.forEach(e => {
        vertexMap.get(e.source.id).edges.push(e)
    })
}