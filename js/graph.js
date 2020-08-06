var Vertex = /** @class */ (function () {
    function Vertex(id, name) {
        this.id = id;
        this.name = name;
    }
    return Vertex;
}());
var Edge = /** @class */ (function () {
    function Edge(id, source, target) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.selected = false;
    }
    return Edge;
}());
var Graph = /** @class */ (function () {
    function Graph(data) {
        var _this = this;
        this.vertices = data.vertices.map(function (d) { return Object.create(d); });
        this.edges = data.edges.map(function (d) { return Object.create(d); });
        this.N = this.vertices.length;
        this.E = this.edges.length;
        // Give to each vertex name a unique numeric ID;
        var idMap = new Map();
        this.vertices.map(function (v, i) { return idMap.set(v.id, i); });
        // Replace vertex string IDs with the new numeric ID;
        this.vertices.forEach(function (v) {
            v.name = v.id.toString();
            v.id = idMap.get(v.name);
        });
        // Build a hashmap to retrieve easily a vertex from its ID;
        this.vertexMap = createVerticesMap(this.vertices);
        // Update edges IDs. Store vertex references in each edge, instead of just their ID;
        this.edges = data.edges.map(function (d) { return Object.create(d); }).map(function (e, i) {
            return new Edge(i, _this.vertexMap.get(idMap.get(e.source)), _this.vertexMap.get(idMap.get(e.target)));
        });
        // Store the edges of each vertex inside the vertex.
        // TODO: undirect
        storeEdges(this.vertexMap, this.edges);
    }
    Graph.prototype.vertex = function (id) { return this.vertexMap.get(id); };
    Graph.prototype.neighbours = function (id) { return this.vertexMap.get(id).edges; };
    // Sources must be vertices of the graph, and maxDistance must be >= 0.
    // "skipLastFrontierEdges" is used to avoid selecting edges between vertices with maximum allowed distance;
    Graph.prototype.bfs = function (sources, maxDistance, skipLastFrontierEdges) {
        var _this = this;
        var queue = sources;
        var selected = [];
        // Initialize distance in all sources (distance is undefined in vertices never inspected);
        queue.forEach(function (s) { return s.distance = 0; });
        // Keep a set of vertices that have been already seen;
        var seenVertices = new Set();
        queue.forEach(function (s) { return seenVertices.add(s.id); });
        var _loop_1 = function () {
            var current = queue.shift();
            var currDistance = current.distance;
            selected.push(current);
            current.edges.forEach(function (e) {
                var neighbour = _this.vertexMap.get(e.target.id);
                // Mark this edge as selected;
                if (!skipLastFrontierEdges || currDistance < maxDistance) {
                    e.selected = true;
                }
                else {
                    e.selected = false;
                }
                // Select the new neighbour only if it hasn't been seen before, and the current distance is below the threshold;
                if (!seenVertices.has(neighbour.id)) {
                    e.targetDistance = currDistance + 1;
                    if (maxDistance != undefined && currDistance + 1 <= maxDistance) {
                        neighbour.distance = currDistance + 1;
                        queue.push(neighbour);
                        seenVertices.add(neighbour.id);
                    }
                }
                else {
                    e.targetDistance = neighbour.distance;
                }
            });
        };
        while (queue.length > 0) {
            _loop_1();
        }
        return selected;
    };
    return Graph;
}());
// Build a hashmap to retrieve easily a vertex from its ID;
function createVerticesMap(vertices) {
    var vertexMap = new Map();
    vertices.forEach(function (v) { return vertexMap.set(v.id, v); });
    return vertexMap;
}
// Store the edges of each vertex inside the vertex;
function storeEdges(vertexMap, edges) {
    vertexMap.forEach(function (v, _) { return v.edges = []; });
    edges.forEach(function (e) {
        vertexMap.get(e.source.id).edges.push(e);
    });
}
