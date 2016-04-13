
# A-STAR.ts

Pretty self-explanatory
This is a graph-based implementation of the A* algorithm... made with TypeScript and LoDash

because I love TypeScript and I happen to be using it at the moment to make the game that made me develop this library in the first place


## So how do I use it

Include A-STAR.js

Instantiate the ASTAR.Map class like so:
```
  var map = new ASTAR.Map(graph);
```

with "graph" being a JSON representation of your graph, in the following format:
```
[
  {"x": x,"y": y,"connectedTo": [nodeIndex, anotherNodeIndex]},
  {"x": x,"y": y,"connectedTo": [nodeIndex, anotherNodeIndex]}.......
]
```

node indexes starting with 0 being the first node in your array

The Map class is rather simple, yet hopefully entails all the functionality you need,
it provides 3 methods:

```
map.path(A, B);
```
The above will return the shortest path from node A to B

```
var map2 = map.append({"x": x,"y": y,"connectedTo": [nodeIndex]});
```
This will return a copy of "map" with a newly appended node
Specially useful when most of your Map won't change but you need it to be somewhat flexible

```
map.dump();
```
This will return a JSON representation of "map", in the previously specified format.



Also, I left a publicly accessible ASTAR.distance(x1, y1, x2, y2)
because you never know when it might be useful, it certainly has been to me!
