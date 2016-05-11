/*
  This script is a TypeScript implementation of the A* algorythm.
  Written by Javier Reyes Ribes <cobretti124@gmail.com>
  Dependencies: LoDash.
*/

"use strict";
module ASTAR {

  // This interface is used to append origin and destination nodes to the Map object
  interface Node {
    x: number;
    y: number;
    connectedTo: number[];
  }

  // This interface represents queue items.
  interface Path {
    path: number[];
    accum: number;
    heur: number;
  }


  /**
    *  Calculates the distance between 2 points
    *Can be used in other contexts as: ASTAR.distance
    */
  export function distance(x1: number, y1: number, x2: number, y2: number) {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      // Thanks Pithagoras.
  }

  export class Map {
    public nodeArray: any[];

    constructor(nodeArray: any[]) {
      this.nodeArray = nodeArray;
    }

    // This function is the actual A* "brain".
    path(orig: number, dest: number): number[] {
      var extendedList: number[] = [orig],
        curBranch, curNode: Node,
        Q: Path[] = [{
          "path": [orig],
          "accum": 0,
          "heur": distance(
            this.nodeArray[orig].x, this.nodeArray[orig].y, // origin
            this.nodeArray[dest].x, this.nodeArray[dest].y  // destination
          )
        }],
        iter: number = 0;

      // To avoid crashing, the program limits A* to 60 iterations.
      while (iter < 60) {
        // First, we must fetch the lowest accumulated distance + heuristic distance
        Q = _.sortBy(Q, function(n) {
          return n.accum + n.heur;
        });
        curBranch = _.first(Q);

        // Fetch the last Node in the current branch
        curNode = this.nodeArray[_.last(curBranch.path)];

        // Check if the current Node is connected to the destination
        if (_.includes(curNode.connectedTo, dest)) {
          // If so, we're done.
          return curBranch.path.concat(dest);
        }

        // Otherwise we extend the current node
        for (var i of curNode.connectedTo) {
          // Cutting off the nodes that we've already extended
          if (!(_.includes(extendedList, i))) {
            // We push the node into the extended list
            extendedList.push(i);
            // And into the queue, calculating the distances.
            Q.push({
              "path": curBranch.path.concat(i),
              "accum": curBranch.accum + distance(
                curNode.x, curNode.y,                   // From last node in original Q
                this.nodeArray[i].x, this.nodeArray[i].y  // To the next node
              ),
              "heur": distance(
                this.nodeArray[i].x, this.nodeArray[i].y,       // From the next node
                this.nodeArray[dest].x, this.nodeArray[dest].y  // To our final destination.
              )
            });
          }
        }
        // We then destroy the original path we have just extended.
        Q = _.rest(Q);

        iter++;
      }
    }

    // Returns a disposable cloned Map with an appended node.
    append(node: Node): Map {
      var clone = new Map( _.cloneDeep(this.nodeArray));

      clone.nodeArray.push(node);


      for (var n of node.connectedTo){
        clone.nodeArray[n].connectedTo.push(clone.nodeArray.length - 1);
      }

      return clone;
    }

    // Returns a disposable cloned Map where the specified node removed.
    remove(nodeI: number): Map {
      var value: number,
        i: any, // for the sake of compliance with LoDash type specs
        clone = new Map( _.cloneDeep(this.nodeArray));


      // Pull the node from the nodeArray.
      _.pullAt(clone.nodeArray, nodeI);

      for (var n of clone.nodeArray) {
        console.log(n.connectedTo);

        // Remove the specified node from all other nodes' connections.
        _.remove(n.connectedTo, function(n) {
          return n === nodeI;
        });

        for (i in n.connectedTo) {
          value = n.connectedTo[i];

          if (value > nodeI) {
            /* Because I am pulling from the array, everything
              after the removed node will have NODEindex-- */
            n.connectedTo[i]--;
          }
        }
        console.log(n.connectedTo);
      }

      return clone;
    }

    // Useful for debugging.
    dump(): string {
      return JSON.stringify(this.nodeArray);
    }
  }
}
