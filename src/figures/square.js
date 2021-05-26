export default class Square {
    constructor(points) {
        this.vertices = points;                 //вершины
        this.countEdges = 4;                    //количество рёбер
        this.countFaces = 1;                    //количество граней
        this.countEdgesToVertice = 2;           //количество рёбер примыкающих к вершине
        this.countPolygonsInOneFace = 2;        //количество полигонов в грани

        this.colorMesh = 0x9922FF;
        this.pointsMesh = this._getMesh();
    }

    _getMesh() {
        return [
            this.vertices[0], this.vertices[1], this.vertices[3], 
            this.vertices[2], this.vertices[1], this.vertices[3]
        ];
    }
}

