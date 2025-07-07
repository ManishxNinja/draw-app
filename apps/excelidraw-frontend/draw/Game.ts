import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    points: {x: number; y:number}[];
}

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private currentPencilPoints: { x:number; y: number }[] = [];
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle";

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: "circle" | "pencil" | "rect") {
        this.selectedTool = tool;
    }

    async init() {
        console.log("Initialized the ExistingSHapes")
        this.existingShapes = await getExistingShapes(this.roomId);
        console.log("Total Shapes::::",this.existingShapes);
        this.clearCanvas();
    }

    initHandlers() {
        console.log("INitialized socket Handlers")
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Message Recievedddd:::::");

            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape.shape)
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawAllShapes();
    }

    drawAllShapes() {
        for (const shape of this.existingShapes) {
            this.ctx.strokeStyle = "white";
            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(
                    shape.centerX,
                    shape.centerY,
                    Math.abs(shape.radius),
                    0,
                    Math.PI * 2
                );
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "pencil") {
                this.drawPencilShape(shape);
            }
        }
    }

    drawPencilShape(shape: {type: "pencil";points: {x:number;y:number}[]}) {
        if(shape.points.length < 2) return;
        
        this.ctx.beginPath();
        this.ctx.moveTo(shape.points[0].x,shape.points[0].y);
        for(let i = 1; i < shape.points.length;i++) {
            this.ctx.lineTo(shape.points[i].x,shape.points[i].y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawCurrentPencil() {
        if(this.currentPencilPoints.length < 2) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentPencilPoints[0].x,this.currentPencilPoints[0].y);
        for(let i = 1; i < this.currentPencilPoints.length;i++) {
            this.ctx.lineTo(this.currentPencilPoints[i].x,this.currentPencilPoints[i].y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX
        this.startY = e.clientY

        if(this.selectedTool === "pencil") {
            this.currentPencilPoints = [{ x: e.clientX, y: e.clientY }];
        }
        
        
    }
    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        if (selectedTool === "rect") {

            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            }
        } else if(selectedTool === "pencil" && this.currentPencilPoints.length > 1) {
            shape = {
                type: "pencil",
                points: [...this.currentPencilPoints],
            }
            this.currentPencilPoints = [];
        }

        if (!shape) {
            return;
        }

        this.existingShapes.push(shape);

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: Number(this.roomId)
        }));
    }
    mouseMoveHandler = (e: MouseEvent) => {

        if (!this.clicked) return;

        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        this.clearCanvas(); // clears and re-renders existing shapes
        this.ctx.strokeStyle = "white";

        if (this.selectedTool === "rect") {
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        } else if (this.selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            const centerX = this.startX + radius;
            const centerY = this.startY + radius;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();
        } else if (this.selectedTool === "pencil") {
            this.currentPencilPoints.push({ x: e.clientX, y: e.clientY });
            this.drawCurrentPencil();
        }
    }



    initMouseHandlers() {
        console.log("INITialized Mouse Handlersss:::");
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)    

    }
}
