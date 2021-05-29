export default function initSceneController(canvas, objectUnderControl, camera, WIDTH_CANVAS, HEIGHT_CANVAS) {
    orbitControls(canvas, objectUnderControl, camera, WIDTH_CANVAS, HEIGHT_CANVAS);
}

function orbitControls(canvas, pointOfView, camera, WIDTH_CANVAS, HEIGHT_CANVAS) {
    let wheelMouseState = {
        holdButton : false, 
    
        beginPositionX : undefined, 
        beginPositionY : undefined, 
    
        previousPositionX : undefined, 
        previousPositionY : undefined,
    
        coef : 1,
    }

    canvas.onmousedown = function(event){    
        if (event.which == 2) {
            wheelMouseState.beginPositionX = event.offsetX; 
            wheelMouseState.beginPositionY = event.offsetY;
            wheelMouseState.holdButton = true;
        }
    }

    canvas.onmouseup = function(event) {    
        if (event.which == 2 && wheelMouseState.holdButton) {
            wheelMouseState.holdButton = false;
        }
    }
    

    canvas.onwheel = function(event) {
        if (event.deltaY < 0) camera.translateZ(-1);
        if (event.deltaY > 0) camera.translateZ(+1);
    }


    canvas.onmousemove = function(event) {    
        if (wheelMouseState.holdButton) {
    
            let stepX = (wheelMouseState.beginPositionX - event.offsetX) / WIDTH_CANVAS;
            let stepY = (wheelMouseState.beginPositionY - event.offsetY) / HEIGHT_CANVAS;
    
            if (   stepX < 0 && wheelMouseState.previousPositionX > event.offsetX 
                || stepX > 0 && wheelMouseState.previousPositionX < event.offsetX) {
                    wheelMouseState.beginPositionX = wheelMouseState.previousPositionX;
            }
            if (   stepY < 0 && wheelMouseState.previousPositionY > event.offsetY
                || stepY > 0 && wheelMouseState.previousPositionY < event.offsetY) {
                    wheelMouseState.beginPositionY = wheelMouseState.previousPositionY;
            }
    
            camera.translateX(stepX / wheelMouseState.coef);
            camera.translateY(-stepY / wheelMouseState.coef);
    
            wheelMouseState.previousPositionX = event.offsetX;
            wheelMouseState.previousPositionY = event.offsetY;
        }
        camera.lookAt(pointOfView);
        camera.updateMatrixWorld();
    }
}