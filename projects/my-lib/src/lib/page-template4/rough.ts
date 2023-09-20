// toggleNode(node: DynamicFlatNode, expand: boolean) {
//         const index = this.data.indexOf(node);
//         const cachedChildren = this._database.getChildrenFromCache(node);
//         if (cachedChildren) {
//           console.log(cachedChildren);
//           // Children are already cached, use them
//           this.insertCachedChildren(node, cachedChildren);
//             // console.log("asasa");
            
//             let count = 0;
//             for (
//               let i = index + 1;
//               i < this.data.length && this.data[i].level > node.level;
//               i++, count++
//             ) { }
//             this.data.splice(index + 1, count);
//           this.dataChange.next(this.data);
//           node.isLoading = false;
//         }
//     else{
// this._database.getChildrenFromApi(node.item).subscribe((result: any) => {
//     console.log("saa");
//     const index = this.data.indexOf(node);
//     if (expand) {
//       // console.log(node);
//       // console.log(expand);
//       node.isLoading = true;

//       const TempResult = result;
//       var namesArray: string[] = [];

//       // Loop through the JSON data and push the "name" value to the namesArray 
//       TempResult.forEach((item: any) => {
//         namesArray.push(item.name);
//       });
//       const Result = namesArray;
//       // string[]=[];
//       const nodes = Result.map(
//         (name: any) =>{

        
//         const filteredObjects = result.filter((obj:any) => obj.name==name);
//         return  new DynamicFlatNode(
//             name,
//             node.level + 1,
//             true,
//             false,
//            filteredObjects[0].IsChildAvailaible
//           )}
//       );
//       // console.log(nodes);
//       this.data.splice(this.data.indexOf(node) + 1, 0, ...nodes);
//       this._database.cacheChildren(node, nodes);
//     }

//     else {
//       console.log("asasa")
//       let count = 0;
//       for (
//         let i = index + 1;
//         i < this.data.length && this.data[i].level > node.level;
//         i++, count++
//       ) { }
//       this.data.splice(index + 1, count);
//     }
//     this.dataChange.next(this.data);
//     node.isLoading = false;
   

//   });
// }
// }