"use strict";
var ASTAR;
(function (ASTAR) {
    function distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    }
    ASTAR.distance = distance;
    var Map = (function () {
        function Map(nodeArray) {
            this.nodeArray = nodeArray;
        }
        Map.prototype.path = function (orig, dest) {
            var extendedList = [orig], curBranch, curNode, Q = [{
                    "path": [orig],
                    "accum": 0,
                    "heur": distance(this.nodeArray[orig].x, this.nodeArray[orig].y, this.nodeArray[dest].x, this.nodeArray[dest].y)
                }], iter = 0;
            while (iter < 60) {
                Q = _.sortBy(Q, function (n) {
                    return n.accum + n.heur;
                });
                curBranch = _.first(Q);
                curNode = this.nodeArray[_.last(curBranch.path)];
                if (_.includes(curNode.connectedTo, dest)) {
                    return curBranch.path.concat(dest);
                }
                for (var _i = 0, _a = curNode.connectedTo; _i < _a.length; _i++) {
                    var i = _a[_i];
                    if (!(_.includes(extendedList, i))) {
                        extendedList.push(i);
                        Q.push({
                            "path": curBranch.path.concat(i),
                            "accum": curBranch.accum + distance(curNode.x, curNode.y, this.nodeArray[i].x, this.nodeArray[i].y),
                            "heur": distance(this.nodeArray[i].x, this.nodeArray[i].y, this.nodeArray[dest].x, this.nodeArray[dest].y)
                        });
                    }
                }
                Q = _.rest(Q);
                iter++;
            }
        };
        Map.prototype.append = function (node) {
            var clone = new Map(_.cloneDeep(this.nodeArray));
            clone.nodeArray.push(node);
            for (var _i = 0, _a = node.connectedTo; _i < _a.length; _i++) {
                var n = _a[_i];
                clone.nodeArray[n].connectedTo.push(clone.nodeArray.length - 1);
            }
            return clone;
        };
        Map.prototype.dump = function () {
            return JSON.stringify(this.nodeArray);
        };
        return Map;
    }());
    ASTAR.Map = Map;
})(ASTAR || (ASTAR = {}));
