import React, { Component } from "react";
import { Button,Modal } from 'react-bootstrap';
import './mazeContainer_1.css'
import Draggable from 'react-draggable';
var Heap = require('heap');
var stk = [];

class Mazecontainer_1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matrix: {} ,
      startClicked: 0 ,
      endClicked: 0,
      start: {x: 0 , y: 0} ,
      end: {x: 0 , y: 0} ,
      stack: [] ,
      visited: {} ,
      end: {x: 0 , y: 0},
      drag: false,
      w: false,
      b: false ,
      tsp: 100 ,
      height: 30
    };
}

 

    componentWillMount() {
        this.state.maze = [];
        this.state.matrix = [];
        var c = 0;
        for(var i = 0 ; i < 100 ; i++) {
            var temp = [];
            var temp_mat = [];
            for(var j = 0 ; j < 100 ; j++) {
                temp.push(<div id={i+"_"+j} key={c} className="col" className="white-grid-1" onClick={this.Change_color.bind(this)}  onMouseDown={this.handleMouseDown.bind(this) }  onMouseUp={this.handleMouseUp.bind(this)}  onMouseMove={this.handleMouseMove.bind(this)}/>);
                temp_mat.push(0);
                c++;
            }
            this.state.maze.push(<div id = {i} className="row" style={{width: "3000px"}}> 
            {
                temp.map(it => {return it;})
            }
            </div>);
            this.state.matrix.push(temp_mat);
        }
        this.setState({maze: this.state.maze , matrix: this.state.matrix});
        console.log(this.state.matrix);
    }

    componentDidMount() {
        console.log("Hi");
        for(var i = 0 ; i < 100 ; i++) {
            this.state.matrix[0][i] = 1;
            this.state.matrix[99][i] = 1;
            this.state.matrix[i][0] = 1;
            this.state.matrix[i][99] = 1;
            document.getElementById("0_"+i).className = "black-grid-1";
            document.getElementById(i+"_0").className = "black-grid-1";
            document.getElementById(i+"_99").className = "black-grid-1";
            document.getElementById("99_"+i).className = "black-grid-1";
        }
    }

    handleMouseMove(event)
    {
        if(this.state.drag&&this.state.w)
        {
            var th = this.fo(event.target.id);
            var mat = this.state.matrix;
            event.target.className = "black-grid-1";
            mat[th.x][th.y] = 1;
            if(this.state.startClicked === 1) {
               event.target.style.backgroundColor = "green";
               this.setState({startClicked: 0 , start: th})
            }
            if(this.state.endClicked === 1) {
               event.target.style.backgroundColor = "red";
               this.setState({endClicked: 0 , end: th});
            }
            this.setState({matrix: mat});
        }
        if(this.state.drag&&this.state.b)
        {
            var th = this.fo(event.target.id);
            var mat = this.state.matrix;
            event.target.className = "white-grid-1";
            mat[th.x][th.y] = 0;
            if(this.state.startClicked === 1) {
               event.target.style.backgroundColor = "green";
               this.setState({startClicked: 0 , start: th})
            }
            if(this.state.endClicked === 1) {
               event.target.style.backgroundColor = "red";
               this.setState({endClicked: 0 , end: th});
            }
            this.setState({matrix: mat});
        }
  
    }
    handleMouseDown(e) {
        if(e.target.className === "white-grid-1")
            this.setState({drag: true, w: true , b: false});
        else
            this.setState({drag: true, w: false , b: true});
    }

    handleMouseUp(e) {
        this.setState({drag: false});
    }

    fo(a) {
        var arr = a.split("_");
        var ret = {x : parseInt(arr[0]) , y : parseInt(arr[1])};
        return ret;
    }

    Change_color(event) {
        var th = this.fo(event.target.id);
        var mat = this.state.matrix;
        if(event.target.className === "white-grid-1") {
            event.target.className = "black-grid-1";
            mat[th.x][th.y] = 1;
        }
        else {
            event.target.className = "white-grid-1";
            mat[th.x][th.y] = 0;
        }
        if(this.state.startClicked === 1) {
            event.target.style.backgroundColor = "green";
            this.setState({startClicked: 0 , start: th});
            mat[th.x][th.y] = 0;
        }
        if(this.state.endClicked === 1) {
            event.target.style.backgroundColor = "red";
            this.setState({endClicked: 0 , end: th});
            mat[th.x][th.y] = 0;
        }
        this.setState({matrix: mat});
        console.log(this.state.start);
        console.log(this.state.end);
    }

    onClickStart() {

        var x = document.getElementById(this.state.start.x + "_" + this.state.start.y);
        x.style.backgroundColor = "white";
        this.setState({startClicked: 1 , endClicked: 0});
    }

    onClickEnd() {
        var x = document.getElementById(this.state.end.x + "_" + this.state.end.y);
        x.style.backgroundColor = "white";
        this.setState({endClicked: 1 , startClicked: 0});
    }

    handlerGo() {
        this.dfs();
    }

    dfs() {
        this.state.stack = [];
        this.state.stack.push(this.state.start);
        this.state.visited = {};
        for(var i = 0 ; i < 100 ; i++) {
            for(var j = 0 ; j < 100 ; j++) 
                this.state.visited[i+"_"+j] = 0;
        }
        this.dfsNextStep();
    }

    dfsNextStep() {
        var temp = this.state.stack.pop();
        if(temp.x == this.state.end.x && temp.y == this.state.end.y) {
            this.state.stack = [];
            return;
        }
        document.getElementById(temp.x+"_"+temp.y).style.backgroundColor = "green";
        this.state.visited[temp.x+"_"+temp.y] = 1;
        var x = temp.x , y = temp.y;
        if(this.state.matrix[x+1][y] == 0 && this.state.visited[(x+1)+"_"+y] === 0) {
            this.state.stack.push({x:x+1 , y:y});
        }
        if(this.state.matrix[x-1][y] == 0 && this.state.visited[(x-1)+"_"+y] === 0) {
            this.state.stack.push({x:x-1 , y:y});
        }
        if(this.state.matrix[x][y+1] == 0 && this.state.visited[(x)+"_"+(y+1)] === 0) {
            this.state.stack.push({x:x , y:y+1});
        }
        if(this.state.matrix[x][y-1] == 0 && this.state.visited[(x)+"_"+(y-1)] === 0) {
            this.state.stack.push({x:x , y:y-1});
        }
        var a = this.state.stack;
        console.log(a);
        if(this.state.stack.length === 0) {   
            return;
        }
        setTimeout(() => {this.dfsNextStep()} , this.state.tsp);
    }


    handleDecreaseTSP()
    {
         this.setState({tsp: this.state.tsp-50>0?this.state.tsp-50:this.state.tsp})
    }
    handleIncreaseTSP()
    {
        this.setState({tsp: this.state.tsp+50})
    }
    zoomIn() {
        this.setState({height: this.state.height + 1});
        for(var i = 0 ; i < 100 ; i++) {
            document.getElementById(i).style.width = (this.state.height*100) + "px";
            for(var j = 0 ; j < 100 ; j++) {
                document.getElementById(i+"_"+j).style.height = this.state.height + "px";
                document.getElementById(i+"_"+j).style.width = this.state.height + "px";
            }
        }
    }

    zoomOut() {
        this.setState({height: this.state.height - 1});
        for(var i = 0 ; i < 100 ; i++) {
            document.getElementById(i).style.width = (this.state.height*100) + "px";
            for(var j = 0 ; j < 100 ; j++) {
                document.getElementById(i+"_"+j).style.height = this.state.height + "px";
                document.getElementById(i+"_"+j).style.width = this.state.height + "px";
            }
        }
    }

  render() {
    console.log(this.state.tsp);
    return (
      <div >
          {this.state.maze.map(it => {
              return it;
          })}
        <div style = {{position : "fixed" , height : "50px" , width : "50px" , borderRadius : "50px" , top : "90%" , left : "50%" , backgroundColor : "rgba(135, 219, 61, 0.9)" , color : "white" , textAlign: "center" , lineHeight: "50px" , fontWeight: "bold"}} onClick={this.handlerGo.bind(this)}>
            Go
        </div>
        <div style = {{position : "fixed" , height : "50px" , width : "50px" , borderRadius : "50px" , top : "90%" , left : "90%" , backgroundColor : "rgba(135, 219, 61, 0.9)" , color : "white" , textAlign: "center" , lineHeight: "50px" , fontWeight: "bold"}} onClick={this.onClickStart.bind(this)}>
            Start
        </div>
        <div style = {{position : "fixed" , height : "50px" , width : "50px" , borderRadius : "50px" , top : "90%" , left : "95%" , backgroundColor : "rgba(209, 125, 51, 0.9)" , color : "white" , textAlign: "center" , lineHeight: "50px" , fontWeight: "bold"}} onClick={this.onClickEnd.bind(this)}>
            End
        </div>
        <div style = {{position : "fixed" ,top: "90%" ,right: "85%"}}>
            <i className="fa fa-plus-circle fa-6" aria-hidden="true" onClick={this.handleIncreaseTSP.bind(this)}></i>
            <strong style={{fontSize: "30px",margin: "5px"}}>TPS</strong>
            <i className="fa fa-minus-circle fa-6" aria-hidden="true" onClick={this.handleDecreaseTSP.bind(this)}></i>
        </div>

       
       <div style = {{position : "fixed" , height : "30px" , width : "30px" , borderRadius : "30px" , top : "80%" , left : "5%" , backgroundColor : "white" , color : "black" , textAlign: "center" , fontWeight: "bold" , border: "1px solid black" , fontSize: "30px" , padding: "3px" , 
    boxShadow: "1px 1px grey"}} onClick={this.zoomIn.bind(this)}>
         +
        </div>
        <div style = {{position : "fixed" , height : "30px" , width : "30px" , borderRadius : "30px" , top : "85%" , left : "5%" , backgroundColor : "white" , color : "black" , textAlign: "center" , fontWeight: "bold" , border: "1px solid black" , fontSize: "30px" , padding: "3px" ,
    boxShadow: "1px 1px grey"}} onClick={this.zoomOut.bind(this)}>
            -
        </div>
        <Draggable>
            <div className="block">    
                <p className="mb15">Select Algorithm</p>
                <div className="md-radio md-primary">
                    <label>
                        <input type="radio" name="radioDemo" checked=""/> 
                        <span>A*</span>
                    </label>
                </div>
                <div className="md-radio md-warn">
                    <label>
                        <input type="radio" name="radioDemo"/> 
                        <span>DFS</span>
                    </label>
                </div>
                <div className="md-radio">
                    <label>
                        <input type="radio" name="radioDemo"/> 
                        <span>Dijkstra</span>
                    </label>
                </div>
                <div className="md-radio">
                    <label>
                        <input type="radio" name="radioDemo"/> 
                        <span>IDA*</span>
                    </label>
                </div>
                <div className="md-radio">
                    <label>
                        <input type="radio" name="radioDemo"/> 
                        <span>Best-First-Search</span>
                    </label>
                </div>
            </div>
        </Draggable>
      </div>
    );
  }
}


export default Mazecontainer_1;