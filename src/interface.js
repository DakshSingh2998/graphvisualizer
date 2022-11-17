import './interface.css';
import React from "react";
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
let speed = 2;
var mouseDown = 0;
document.body.onmousedown = function () {
    ++mouseDown;
}
document.body.onmouseup = function () {
    --mouseDown;
}
let sAlgo = 0;
let nodes = 0;
let adj = [];
let matnodemap = {};
let nodematmap = {};
let adjpath = {};
let tablebackup = "";
class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(element) {
        this.items.push(element);
    }
    dequeue() {
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    front() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    printQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }
}
///////////////////////////// pq
class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

// PriorityQueue class
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    enqueue(element, priority) {
        var qElement = new QElement(element, priority);
        var contain = false;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
        if (!contain) {
            this.items.push(qElement);
        }
    }
    dequeue() {
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    front() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    rear() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    printPQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].element + " ";
        return str;
    }
}
let mat = []
let totalr = 20;
let totalc = 40;
let prevselx = -1;
let prevsely = -1;

async function resetColor() {
    var cells = document.querySelectorAll("td")
    for (var i = 0; i < cells.length; i++) {
        if (cells[i].style.backgroundColor === "red") {
            continue;
        }
        cells[i].style.backgroundColor = "#D3D3D3";
    }
    tablebackup = document.getElementById("tbody").innerHTML;
}



async function tableText() {
    const cur = String(this.id).split(",");
    let x = parseInt(cur[0]);
    let y = parseInt(cur[1]);
    if (mat[x][y] === 0) {
        document.getElementById(String(this.id)).innerHTML = String.fromCharCode(nodes + 65);
        adj.push([]);
        matnodemap[[x, y]] = nodes;
        nodematmap[nodes] = [[x, y]];
        nodes++;
        mat[x][y] = 1;
        tablebackup = document.getElementById("tbody").innerHTML;
    }
    else if (mat[x][y] === 1 && prevselx === -1) {
        prevselx = x;
        prevsely = y;
        document.getElementById("timer").innerHTML = "YOU HAVE 3S TO SELECT ANOTHER NODE";
        await snooze(1000);
        document.getElementById("timer").innerHTML = "YOU HAVE 2S TO SELECT ANOTHER NODE";
        await snooze(1000);
        document.getElementById("timer").innerHTML = "YOU HAVE 1S TO SELECT ANOTHER NODE";
        await snooze(1000);
        document.getElementById("timer").innerHTML = "YOU HAVE 0S TO SELECT ANOTHER NODE";
    }
    else {
        let cells = document.querySelectorAll("td")
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].style.backgroundColor !== "yellow") {
                continue;
            }
            cells[i].style.backgroundColor = "red";
        }
        tablebackup = document.getElementById("tbody").innerHTML;
        let x1 = prevselx;
        let x2 = x;
        let y1 = prevsely;
        let y2 = y;
        if (x1 === x2 & y1 === y2) {
            return;
        }

        var queue = new Queue();
        const vis = JSON.parse(JSON.stringify(mat));
        queue.enqueue([ x1, y1,[]]);
        let ans;
        let dely = [-1, 0, 0, 1];
        let delx = [0, -1, 1, 0];
        dely.push(1); delx.push(1);
        dely.push(-1); delx.push(1);
        dely.push(1); delx.push(-1);
        dely.push(-1); delx.push(-1);
        const totalpath = []
        while (!queue.isEmpty()) {
            let curx = queue.front()[0];
            let cury = queue.front()[1];

            totalpath.push([curx, cury]);
            //color
            let idd = String(curx) + "," + String(cury);
            let curbox = document.getElementById(idd);
            if (curbox.style.backgroundColor !== "red") {
                curbox.style.backgroundColor = "pink";
            }
            await snooze(speed);
            const path = JSON.parse(JSON.stringify(queue.front()[2]));
            if (curx === x2 && cury === y2) {
                ans = path;
                break;
            }
            queue.dequeue();
            let j = 0;
            let flag = 0;
            let k = 4;
            if (sAlgo === 1) {
                k = 8;
            }
            while (j < k) {
                let newx = curx + delx[j];
                let newy = cury + dely[j];
                j = j + 1;
                if (newx >= 0 && newx < totalr && newy >= 0 && newy < totalc) {
                    const tpath = JSON.parse(JSON.stringify(path));
                    tpath.push([newx, newy]);
                    if (vis[newx][newy] === 2 || vis[newx][newy] === 3) {
                        continue;
                    }
                    if (vis[newx][newy] === 1) {
                        if (newx === x2 && newy === y2) {
                            ;
                        }
                        else {
                            continue;
                        }
                    }
                    vis[newx][newy] = 2;
                    queue.enqueue([newx, newy, tpath]);
                }
                if (flag === 1) {
                    break;
                }
            }


        }
        //console.log(ans);
        await resetColor();
        if (ans === undefined) {
            alert("Path Not Found");
            document.getElementById("timer").innerHTML = "YOU HAVE 0S TO SELECT ANOTHER NODE";
            prevselx = -1;
            prevsely = -1;
            return;
        }
        let weight = prompt("Please enter Weight", "ʕ ∙ჲ∙ʔ");
        if (weight != null) {
            weight = parseInt(weight);
            if (String(weight) === String(NaN)) {
                document.getElementById("timer").innerHTML = "YOU HAVE 0S TO SELECT ANOTHER NODE";
                prevselx = -1;
                prevsely = -1;
                return;
            }
        }
        else {
            prevselx = -1;
            prevsely = -1;
            return;
        }
        let node1 = matnodemap[[x1, y1]];
        let node2 = matnodemap[[x2, y2]];
        adj[node1].push([weight, node2]);
        //console.log(adj);

        let arrow1 = "";
        let arrow2 = "";
        if (ans[0][0] < x1 && ans[0][1] === y1) {
            arrow1 = "↑";
        }
        else if (ans[0][0] > x1 && ans[0][1] === y1) {
            arrow1 = "↓";
        }
        else if (ans[0][1] < y1 && ans[0][0] === x1) {
            arrow1 = "←";
        }
        else if (ans[0][1] > y1 && ans[0][0] === x1) {
            arrow1 = "→";
        }
        else if (ans[0][0] < x1 && ans[0][1] < y1) {
            arrow1 = "↖";
        }
        else if (ans[0][0] < x1 && ans[0][1] > y1) {
            arrow1 = "↗";
        }
        else if (ans[0][0] > x1 && ans[0][1] < y1) {
            arrow1 = "↙";
        }
        else if (ans[0][0] > x1 && ans[0][1] > y1) {
            arrow1 = "↘";
        }
        else {
            ;
        }
        ///////////////////////////////
        let t = ans.length - 2;
        if (ans[t][0] < x2 && ans[t][1] === y2) {
            arrow2 = "↓";
        }
        else if (ans[t][0] > x2 && ans[t][1] === y2) {
            arrow2 = "↑";
        }
        else if (ans[t][1] < y2 && ans[t][0] === x2) {
            arrow2 = "→";
        }
        else if (ans[t][1] > y2 && ans[t][0] === x2) {
            arrow2 = "←";
        }
        else if (ans[t][0] < x2 && ans[t][1] < y2) {
            arrow2 = "↘";
        }
        else if (ans[t][0] < x2 && ans[t][1] > y2) {
            arrow2 = "↙";
        }
        else if (ans[t][0] > x2 && ans[t][1] < y2) {
            arrow2 = "↗";
        }
        else if (ans[t][0] > x2 && ans[t][1] > y2) {
            arrow2 = "↖";
        }
        else {
            ;
        }
        for (let i = 0; i < ans.length - 1; i++) {
            let idd = String(ans[i][0]) + "," + String(ans[i][1]);
            let curbox = document.getElementById(idd);
            curbox.style.backgroundColor = "red";

            if (i === 0) {
                curbox.innerHTML = arrow1;
            }
            else if (i === ans.length - 2) {
                curbox.innerHTML = arrow2;
            }
            else {
                curbox.innerHTML = weight;
            }
            mat[ans[i][0]][ans[i][1]] = 3;
            await snooze(speed * 10);
        }
        adjpath[matnodemap[[x1, y1]].toString() + matnodemap[[x2, y2]].toString()] = ans;
        tablebackup = document.getElementById("tbody").innerHTML;
    }
    document.getElementById("timer").innerHTML = "YOU HAVE 0S TO SELECT ANOTHER NODE";
    prevselx = -1;
    prevsely = -1;

}
async function load() {
    nodes = 0;
    adj = [];
    matnodemap = {};
    mat = []
    for (let i = 0; i < totalr; i++) {
        mat.push(Array(totalc).fill(0));
    }
    let maindiv = document.getElementById("tbody");
    let str = ""
    for (let i = 0; i < totalr; i++) {
        str = str + "<tr id=\"row " + i + "\">"
        for (let j = 0; j < totalc; j++) {
            str = str + "<td id=\"" + i + "," + j + "\" class=\"blank\" </td>";
        }
        str = str + "</tr>";
    }
    maindiv.innerHTML = str;
    var cells = document.querySelectorAll("td")

    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", tableText);
    }
    await resetColor();
}

async function sChanged() {
    sAlgo = document.getElementById("sAlgo").selectedIndex;
    await load();
}
////////////////// dijiktra
async function dijiktra() {
    //// restore
    document.getElementById("tbody").innerHTML = tablebackup;
    var cells = document.querySelectorAll("td")
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", tableText);
    }
    //////////////
    let x = prevselx;
    let y = prevsely;
    if(x===-1){
        alert("please select a source vertex");
        return;
    }

    let destination = prompt("Please enter Destination Vertex", "🐇");
    destination = destination.toUpperCase();
    let destination2 = destination;
    destination = destination.charCodeAt(0) - 65;
    
    
    let dist = [];
    for (let i = 0; i < nodes; i++) {
        dist.push([1e9, []]);
    }
    let curnode = matnodemap[[x, y]];
    dist[curnode][0] = 0;
    //dist[curnode][1].push(String.fromCharCode(curnode + 65));
    let pq = new PriorityQueue();
    pq.enqueue(curnode, 0);
    while (!pq.isEmpty()) {
        let cur = pq.front();
        pq.dequeue();
        let curnode = cur.element;
        let curdist = cur.priority;
        for (let i = 0; i < adj[curnode].length; i++) {
            let tempdist = adj[curnode][i][0];
            let tempnode = adj[curnode][i][1];
            let temptotal = curdist + tempdist;
            //console.log(temptotal, dist[tempnode][0]);
            if (temptotal < dist[tempnode][0]) {
                dist[tempnode][0] = temptotal;
                let temppath = [...dist[curnode][1]];
                temppath.push(String.fromCharCode(curnode + 65));
                dist[tempnode][1] = temppath;
                pq.enqueue(tempnode, temptotal);
            }
        }
    }
    /////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    console.log(dist, destination);
    let anspath = dist[destination][1];
    anspath.push(destination2);
    console.log(anspath);
    if(dist[destination][0]===1e9){
        alert("No Path exists");
    }
    for (let ti = 0; ti < anspath.length - 1; ti++) {
        let ans = adjpath[(anspath[ti].charCodeAt(0) - 65).toString() + (anspath[ti + 1].charCodeAt(0) - 65).toString()];
        for (let i = 0; i < ans.length - 1; i++) {
            let idd = String(ans[i][0]) + "," + String(ans[i][1]);
            let curbox = document.getElementById(idd);
            curbox.style.backgroundColor = "yellow";
            await snooze(speed * 20);
        }
    }
    let showpath="";
    for(let i=0;i<anspath.length-1;i++){
        showpath=showpath+ anspath[i] + " to ";
    }
    showpath=showpath + anspath[anspath.length -1];
    alert("Shortest path with minimum cost of "+ dist[destination][0].toString() + " from " + String.fromCharCode(curnode + 65) + " to " + destination2 + " is\n" + showpath)


}

class Interface extends React.Component {
    render() {
        window.onload = async function () {
            load();
            alert("Click anywhere to put a Vertex.\nClick a vertex and select another vertex to make edge.\nClick a vertex and click Dijiktra button to find shortest path.")
        }
        return (
            <div id="base">
                <h1>PATH FINDER</h1>
                <table id="board">
                    <tbody id="tbody">

                    </tbody>
                </table>
                <br></br>
                <div>
                    <button onClick={load}>Clear</button>
                    <select name="Algo" id="sAlgo" onChange={sChanged}>
                        <option value="sBFS">BFS</option>
                        <option value="sDIJ">DIJ</option>
                    </select>
                    <label id="timer">YOU HAVE 0S TO SELECT ANOTHER NODE</label>
                    <button onClick={dijiktra}>Select Source Node for Dijiktra and Click me :)</button>
                </div>
            </div>
        );
    };
};
export default Interface;
