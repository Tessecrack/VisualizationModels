export default class Thetra {
    constructor(points) {
        
        this.vertices = points; 
        this.countEdges = 6;
        this.countFaces = 4; 
        this.countEdgesToVertice = 3;
        this.countPolygonsInOneFace = 1;

        this.colorMesh = 0xED5599;
        this.strColorMesh = '#ED5599';
        this.pointsMesh = this._getMesh();
    }

    _getMesh() {
        return [
            this.vertices[0], this.vertices[1], this.vertices[2], 
            this.vertices[0], this.vertices[2], this.vertices[3],
            this.vertices[0], this.vertices[3], this.vertices[1],
            this.vertices[3], this.vertices[2], this.vertices[1]
        ]
    }
}
