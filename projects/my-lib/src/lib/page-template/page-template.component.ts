// import { CollectionViewer, SelectionChange, DataSource } from '@angular/cdk/collections';
// import { FlatTreeControl } from '@angular/cdk/tree';
// import { Component, Injectable, Input } from '@angular/core';
// import { BehaviorSubject, merge, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { NgIf } from '@angular/common';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatTreeModule } from '@angular/material/tree';
// import { HttpClient } from '@angular/common/http';
// import { MyLibService } from '../my-lib.service';

// /* Flat node with expandable and level information */
// export class DynamicFlatNode {
//   constructor(
//     public item: string,
//     public level = 1,
//     public expandable = false,
//     public isLoading = false,
//     public IsChildAvailaible:string 
//   ) { }
// }

// /**
//  * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
//  * the descendants data from the database.
//  */
// @Injectable({ providedIn: 'root' })
// export class DynamicDatabase {
//   constructor(private http: HttpClient, private dataservice: MyLibService) { }
//   dataMap = new Map<string, string[]>([
//     // dataMap = new Map<string, Map<string[],boolean>>([ 
//     // ['Fruits', ['Apple', 'Orange', 'Banana']],
//     // ['Vegetables', ['Tomato', 'Potato', 'Onion']],
//     // ['Apple', ['Fuji', 'Macintosh']],
//     // ['Onion', ['Yellow', 'White', 'Purple']],
//   ]);

//   // rootLevelNodes: string[] = ['Fruits', 'Vegetables'];
//   rootLevelNodes: string[] = [];



//   /* Initial data from database */
//   // initialData(ApiResponse:any): DynamicFlatNode[] {
//   //       console.log(ApiResponse);
//   //   return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
//   // }


//   initialData(ApiResponse:any): DynamicFlatNode[] {
//     // console.log(ApiResponse);
//     // // var index=0;
//     const rootNodeData: DynamicFlatNode[] = this.rootLevelNodes.map((name) => {
//       // console.log(IsChildAvailaible);
//       // console.log(name);
//       // console.log(item);
      
//       // const isChildAvailable = IsChildAvailaible === "true";
//       // Fetch data for each root-level node from the API
//       // const apiResponse = this.fetchNodeDataFromAPI(name);
      
//       // Create a DynamicFlatNode instance with 'IsChildAvailable' information
//       // console.log(name);
//       const filteredObjects = ApiResponse.filter((obj:any) => obj.name==name);
    
//       // const ChildAvailaibleOrNot=filteredObjects[0].IsChildAvailable;
//       // console.log(filteredObjects[0].IsChildAvailaible);
//       return new DynamicFlatNode(
//         name,
//         0, 
//         true,
//         ApiResponse[0].length > 0 ,// Assuming children are the first element of the tuple
//         filteredObjects[0].IsChildAvailaible
//       );
//     },

//     );
//     console.log(rootNodeData);
//     return rootNodeData;
//   }
  
//   //   // Initialize the dataMap for root-level nodes
//   //   this.rootLevelNodes.forEach(name => {
//   //     if (!this.dataMap.has(name)) {
//   //       this.dataMap.set(name, { children: [], isChildAvailable: false });
//   //     }
//   //   });
  
//   //   // Initialize the dataMap for child nodes based on API response
//   //   rootNodeData.forEach(node => {
//   //     const nodeData = this.dataMap.get(node.item);
  
//   //     if (nodeData) {
//   //       nodeData.isChildAvailable = node.isChildAvailable;
  
//   //       if (node.isChildAvailable) {
//   //         nodeData.children = nodeData.children.concat(node.children);
//   //       }
//   //     }
//   //   });
  
//   //   return rootNodeData;
//   // }
  
//   // initialData1(): Observable<DynamicFlatNode[]> {
//   //   return forkJoin(
//   //     this.rootLevelNodes.map(name => 
//   //       this.fetchNodeDataFromAPI(name).pipe(
//   //         map(apiResponse => 
//   //           new DynamicFlatNode(
//   //             name, 
//   //             0, 
//   //             apiResponse.isChildAvailable, 
//   //             apiResponse.children.length > 0
//   //           )
//   //         )
//   //       )
//   //     )
//   //   );
//   // }
  

//   // getChildren(node: string): string[] | undefined {
    
//   //   return this.dataMap.get(node);
//   // }
//   isExpandable(node: string): boolean {

//     // console.log(node[0]);
//     // console.log(this.dataMap.has(node));
//     return true;
//     // return this.dataMap.has(node);
//     // return node;
//   }
//   getChildrenFromApi(node: string) {
//     return this.http.get('http://localhost:3000/' + node);
//   }
// }
// /**
//  * File database, it can build a tree structured Json object from string.
//  * Each node in Json object represents a file or a directory. For a file, it has filename and type.
//  * For a directory, it has filename and children (a list of files or directories).
//  * The input will be a json object string, and the output is a list of `FileNode` with nested
//  * structure.
//  */
// export class DynamicDataSource implements DataSource<DynamicFlatNode> {
//   dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

//   get data(): DynamicFlatNode[] {
//     return this.dataChange.value;
//   }
//   set data(value: DynamicFlatNode[]) {
//     this._treeControl.dataNodes = value;
//     this.dataChange.next(value);
//   }

//   constructor(
//     private _treeControl: FlatTreeControl<DynamicFlatNode>,
//     private _database: DynamicDatabase,
//     private http: HttpClient
//   ) { }
//   //returns an Observable that emits the tree data.
//   connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
//     this._treeControl.expansionModel.changed.subscribe(change => {
//       if (
//         (change as SelectionChange<DynamicFlatNode>).added ||
//         (change as SelectionChange<DynamicFlatNode>).removed
//       ) {
//         this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
//       }
//     });

//     return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
//   }

//   disconnect(collectionViewer: CollectionViewer): void { }

//   /* Handle expand/collapse behaviors */
//   handleTreeControl(change: SelectionChange<DynamicFlatNode>) {

//     if (change.added) {
//       change.added.forEach(node => this.toggleNode(node, true));
//     }
//     if (change.removed) {
//       change.removed
//         .slice()
//         .reverse()
//         .forEach(node => this.toggleNode(node, false));
//     }
//   }
//   toggleNode(node: DynamicFlatNode, expand: boolean) {
//     this._database.getChildrenFromApi(node.item).subscribe((result: any) => {
//       // console.log(result);
//       const index = this.data.indexOf(node);
//       if (expand && node.expandable && !node.isLoading && node.IsChildAvailaible=='true') {
//         console.log(node);
//         node.isLoading = true;

//         const TempResult = result;
//         var namesArray: string[] = [];

//         // Loop through the JSON data and push the "name" value to the namesArray 
//         TempResult.forEach((item: any) => {
//           namesArray.push(item.name);
//         });
//         const Result = namesArray;
//         // string[]=[];
//         const nodes = Result.map(
//           (name: any) =>{

          
//           const filteredObjects = result.filter((obj:any) => obj.name==name);
//           return  new DynamicFlatNode(
//               name,
//               node.level + 1,
//               true,
//               false,
//              filteredObjects[0].IsChildAvailaible
//             )}
//         );
//         // console.log(nodes);
//         this.data.splice(this.data.indexOf(node) + 1, 0, ...nodes);
//       }

//       else {
//         let count = 0;
//         for (
//           let i = index + 1;
//           i < this.data.length && this.data[i].level > node.level;
//           i++, count++
//         ) { }
//         this.data.splice(index + 1, count);
//       }
//       this.dataChange.next(this.data);
//       node.isLoading = false;

//     });
//   }
// }

// /**
//  * @title Tree with dynamic data
//  */

// @Component({
//   selector: 'lib-page-template',
//   templateUrl: './page-template.component.html',
//   styleUrls: ['./page-template.component.css']
// })
// export class PageTemplateComponent {

//   @Input() ApiUrl1: string = "";
//   constructor(public database: DynamicDatabase, private http: HttpClient) {
//     this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
//     this.dataSource = new DynamicDataSource(this.treeControl, database, http);
//   }
//   ngOnInit() {
//     this.http.get<DynamicFlatNode[]>(this.ApiUrl1).subscribe((result) => {
//       var namesArray: string[] = [];
//       const TempResult=result;
//       // Loop through the JSON data and push the "name" value to the namesArray 
//       TempResult.forEach((item: any) => {
//         namesArray.push(item.name);
//       });
//       // console.log(TempResult);
//       // console.log(namesArray);
//       const Result = namesArray;
      

//       // Array Ka Name
//       this.database.rootLevelNodes = namesArray;  // Setting The RootLevelNodes to Our Database RootLevelNodes
//       this.dataSource.data = this.database.initialData(result); //
//     })
//   }


//   treeControl: FlatTreeControl<DynamicFlatNode>;

//   dataSource: DynamicDataSource;

//   getLevel = (node: DynamicFlatNode) => node.level;

//   isExpandable = (node: DynamicFlatNode) => node.expandable;

//   hasChild = (_: number, NodeData: DynamicFlatNode) => NodeData.IsChildAvailaible;

// }
