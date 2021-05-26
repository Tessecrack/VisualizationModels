export default class Cube {
    constructor(points) {
        this.vertices = points;                 //вершины
        this.countEdges = 12;                   //количество рёбер 
        this.countFaces = 6;                    //количество граней
        this.countEdgesToVertice = 3;           //количество рёбер примыкающих к вершине
        this.countPolygonsInOneFace = 4;        //количество полигонов в одной грани

        this.colorMesh = 0x99ffCC;
        this.pointsMesh = this._getMesh();
    }

    _getMesh() {
        return [
            this.vertices[0], this.vertices[1], this.vertices[3], //back 
            this.vertices[2], this.vertices[1], this.vertices[3], 

            this.vertices[0], this.vertices[1], this.vertices[5], //left
            this.vertices[6], this.vertices[1], this.vertices[5], 

            this.vertices[0], this.vertices[5], this.vertices[3], //down
            this.vertices[4], this.vertices[5], this.vertices[3], 

            this.vertices[1], this.vertices[6], this.vertices[2], //up
            this.vertices[7], this.vertices[6], this.vertices[2],

            this.vertices[2], this.vertices[3], this.vertices[7], //right
            this.vertices[4], this.vertices[3], this.vertices[7], 

            this.vertices[4], this.vertices[5], this.vertices[7], 
            this.vertices[6], this.vertices[5], this.vertices[7]
        ]
    }
}