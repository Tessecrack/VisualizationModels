import {default as Line} from './line'

export default class Triangle {
    constructor(points) {
        this.vertices = points;                 //вершины
        this.countEdges = 3;                    //количество рёбер 
        this.countFaces = 1;                    //количество граней
        this.countEdgesToVertice = 1;           //количество рёбер примыкающих к вершине
        this.countPolygonsInOneFace = 1;        //количество полигонов в одной грани

        this.colorMesh = 0xFF1122;
        this.pointsMesh = this._getMesh();
    }

    _getMesh() {
        return this.vertices; 
    }
}