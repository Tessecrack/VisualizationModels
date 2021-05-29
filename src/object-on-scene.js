import {default as Triangle} from './figures/triangle'
import {default as Square}   from './figures/square'
import {default as Thetra}   from './figures/thetra'
import {default as Cube}     from './figures/cube'

export default class ObjectOnScene {
    constructor(name, points, number = 0, isHelper = false) {
        this.key = name;
        this.name = name + number; 
        this.points = points;
        
        this.checker = undefined;
        this.figure = undefined; 

        switch (this.key) {
            case 'triangles': 
                this.figure = new Triangle(this.points);
                break;
            case 'squares':
                this.figure = new Square(this.points);
                break;
            case 'thetra' :
                this.figure = new Thetra(this.points);
                break;
            case 'cubes' :
                this.figure = new Cube(this.points);
            default: break;
        }

        this.colorPicker = undefined;

        this.mesh = undefined; 
        this.lineSegments = undefined; 

        this.pointsMesh = this.figure.pointsMesh;

        this.listPolygons = [];
        this.colorPolygon = 0xffff00;

        this.centerPoint = this._getCenterPoint();

        this.nameContentHTMLButton  = this.name + "button";
        this.nameContentHTMLCheckbox = this.name + "checkbox";
        this.nameContentHTMLColorPicker = this.name + "colorPicker";

        this.styleContentHTML = "<font><div><input type=\"checkbox\" id=" + this.nameContentHTMLCheckbox + " name=" 
        + this.name + " checked> <label for="+this.name + ">" 
        + this.name + "</label><button id=\"" + this.nameContentHTMLButton + 
        "\" style=\"margin: 3px 3px 3px 10px; padding: 2px 2px 2px 2px\"><font style=\"\">Выбрать</font></button></div></font>"

        this.styleContentHTMLProperties = 
        "<font><div><label>Цвет: </label><input type=\"color\" id=" + this.nameContentHTMLColorPicker + " value="+this.figure.strColorMesh + "></div></font>";
    }

    _getCenterPoint() {
        let xAverage = 0;
        let yAverage = 0;
        let zAverage = 0;

        for (let i = 0; i < this.points.length; i++) {
            xAverage += this.points[i][0];
            yAverage += this.points[i][1];
            zAverage += this.points[i][2];
        }

        xAverage /= this.points.length;
        yAverage /= this.points.length;
        zAverage /= this.points.length;
        return {x : xAverage, y : yAverage, z : zAverage};
    }

    _getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}