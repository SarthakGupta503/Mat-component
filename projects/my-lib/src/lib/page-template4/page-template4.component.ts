import { CollectionViewer, SelectionChange, DataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, Input } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { HttpClient } from '@angular/common/http';
import { MyLibService } from '../my-lib.service';

/* Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(
    public item: string,
    public level = 1,
    public expandable = false,
    public isLoading = false,
    public IsChildAvailaible:string 
  ) { }
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({ providedIn: 'root' })
export class DynamicDatabase {
  constructor(private http: HttpClient, private dataservice: MyLibService) { }
  private nodeCache = new Map<string, DynamicFlatNode[]>();
  getChildrenFromCache(node: DynamicFlatNode): DynamicFlatNode[] | undefined {
    return this.nodeCache.get(node.item);
  }

  cacheChildren(node: DynamicFlatNode, children: DynamicFlatNode[]): void {
    this.nodeCache.set(node.item, children);
  }
  dataMap = new Map<string, string[]>([
    // dataMap = new Map<string, Map<string[],boolean>>([ 
    // ['Fruits', ['Apple', 'Orange', 'Banana']],
    // ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    // ['Apple', ['Fuji', 'Macintosh']],
    // ['Onion', ['Yellow', 'White', 'Purple']],
  ]);

  // rootLevelNodes: string[] = ['Fruits', 'Vegetables'];
  rootLevelNodes: string[] = [];



  /* Initial data from database */
  // initialData(ApiResponse:any): DynamicFlatNode[] {
  //       console.log(ApiResponse);
  //   return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  // }


  initialData(ApiResponse:any): DynamicFlatNode[] {
    // console.log(ApiResponse);
    // // var index=0;
    const rootNodeData: DynamicFlatNode[] = this.rootLevelNodes.map((name) => {
      const filteredObjects = ApiResponse.filter((obj:any) => obj.name==name);
      return new DynamicFlatNode(
        name,
        0, 
        true,
        ApiResponse[0].length > 0 ,// Assuming children are the first element of the tuple
        filteredObjects[0].IsChildAvailaible
      );
    },

    );
    // console.log(rootNodeData);
    return rootNodeData;
  }
 

  isExpandable(node: string): boolean {

    // console.log(node[0]);
    // console.log(this.dataMap.has(node));
    return true;
    // return this.dataMap.has(node);
    // return node;
  }
  getChildrenFromApi(node: string) {
    return this.http.get('http://localhost:3000/' + node);
  }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class DynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase,
    private http: HttpClient
  ) { }
  //returns an Observable that emits the tree data.
  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (
        (change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void { }

  /* Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {

    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
        // console.log(change);
    }
  }
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    if (expand) {
    const index = this.data.indexOf(node);
    const cachedChildren = this._database.getChildrenFromCache(node);
    if (cachedChildren) {
      // console.log(cachedChildren);
      // Children are already cached, use them
      this.insertCachedChildren(node, cachedChildren);
    }
else{
    this._database.getChildrenFromApi(node.item).subscribe((result: any) => {
     
      const index = this.data.indexOf(node);
    
        // console.log(node);
        // console.log(expand);
        // node.isLoading = true;

        const TempResult = result;
        var namesArray: string[] = [];

        // Loop through the JSON data and push the "name" value to the namesArray 
        TempResult.forEach((item: any) => {
          namesArray.push(item.name);
        });
        const Result = namesArray;
        // string[]=[];
        const nodes = Result.map(
          (name: any) =>{
          const filteredObjects = result.filter((obj:any) => obj.name==name);
          return  new DynamicFlatNode(
              name,
              node.level + 1,
              true,
              false,
             filteredObjects[0].IsChildAvailaible
            )}
        );
        // console.log(nodes);
        this.data.splice(this.data.indexOf(node) + 1, 0, ...nodes);
        this._database.cacheChildren(node, nodes);
        this.dataChange.next(this.data);
        console.log("saa");
        // node.isLoading = false;
      })
    }
  }
      else {
        const index = this.data.indexOf(node);
        console.log("asasa");
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > node.level;
          i++, count++
        ) { }
        this.data.splice(index + 1, count);
      }
      this.dataChange.next(this.data);
      console.log("Sarthak");
      node.isLoading = false;
  }

  
private insertCachedChildren(node: DynamicFlatNode, cachedChildren: DynamicFlatNode[]) {
  const index = this.data.indexOf(node);

  if (index > -1) {
    // Add cached children to the tree
    this.data.splice(index + 1, 0, ...cachedChildren);
    this.dataChange.next(this.data);
  }
  node.isLoading = false;
}
}


/**
 * @title Tree with dynamic data
 */

@Component({
  selector: 'lib-page-template4',
  templateUrl: './page-template4.component.html',
  styleUrls: ['./page-template4.component.css']
})
export class PageTemplate4Component {

  @Input() ApiUrl1: string = "";
  treeData:any;
  constructor(public database: DynamicDatabase, private http: HttpClient) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database, http);
  }
  ngOnInit() {
    this.http.get<DynamicFlatNode[]>(this.ApiUrl1).subscribe((result) => {
      var namesArray: string[] = [];
      const TempResult=result;
      // Loop through the JSON data and push the "name" value to the namesArray 
      TempResult.forEach((item: any) => {
        namesArray.push(item.name);
      });
      // console.log(TempResult);
      // console.log(namesArray);
      const Result = namesArray;
      

      // Array's Name
      this.database.rootLevelNodes = namesArray;  // Setting The RootLevelNodes to Our Database RootLevelNodes
      this.dataSource.data = this.database.initialData(result); 
   
      this.treeData = this.dataSource.data ;  // Initialize treeData
      this.dataSource.data = this.treeData; // Set treeData as the initial data source
    })
  }


  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, NodeData: DynamicFlatNode) => NodeData.IsChildAvailaible;
  


  // Start Search 
  TempData:any;
  searchQuery="";
  search(){
    if(this.searchQuery=='')
    {
      this.resetSearch();
      return;
    }
    // this.TempData=this.dataSource.data;
    // if(this.searchQuery!=''){
    // }
    this.treeData = this.dataSource.data;
    const query = this.searchQuery.toLowerCase(); // Convert the search query to lowercase for case-insensitive search
    // console.log( this.treeData );
  // Filter the tree nodes based on the search query
  const filteredNodes = this.treeData.filter((node:DynamicFlatNode) =>
    node.item.toLowerCase().includes(query)
  );

  // Update the tree data with the filtered nodes
  this.dataSource.data = filteredNodes;
  }
  resetSearch(): void {
    this.searchQuery = ''; // Clear the search input
    this.dataSource.data = this.TempData;// Reset the tree data to its original state
  }

}
