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
    public name: string,
    public level : number,
    public id : number,
    public IsChildAvailaible:boolean 
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
    return this.nodeCache.get(node.name);
  }

  cacheChildren(node: DynamicFlatNode, children: DynamicFlatNode[]): void {
    this.nodeCache.set(node.name, children);
  }
  // dataMap = new Map<string, string[]>([
    // dataMap = new Map<string, Map<string[],boolean>>([ 
    // ['Fruits', ['Apple', 'Orange', 'Banana']],
    // ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    // ['Apple', ['Fuji', 'Macintosh']],
    // ['Onion', ['Yellow', 'White', 'Purple']],
  // ]);

  // rootLevelNodes: string[] = ['Fruits', 'Vegetables'];
  rootLevelNodes: string[] = [];

  // get 

  /* Initial data from database */
  // initialData(ApiResponse:any): DynamicFlatNode[] {
  //   return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  // }


  initialData(ApiResponse:any): DynamicFlatNode[] {
    // // var index=0;
    const rootNodeData: DynamicFlatNode[] = this.rootLevelNodes.map((name) => {
      const filteredObjects = ApiResponse.filter((obj: DynamicFlatNode) => obj.name == name);
      return new DynamicFlatNode(
        name,
        1,                // Initially all are at one level
        filteredObjects[0].id,
        filteredObjects[0].IsChildAvailaible
      );
    },

    );
    console.log(rootNodeData);
    return rootNodeData;
  }
 

 
  getChildrenFromApi(id: number) {
    return this.http.get('http://localhost:3000/' + id);
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
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private treeControl: FlatTreeControl<DynamicFlatNode>,
    private database: DynamicDatabase,
    private http: HttpClient
  ) { }
  //returns an Observable that emits the tree data.
  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this.treeControl.expansionModel.changed.subscribe(change => {
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
    const index = this.data.indexOf(node);
    // If Child is not Availaible
    // console.log(node);
    if (!node.IsChildAvailaible)
      return;
    if (expand) {
      // console.log(index);
      // If Data is availaible in the cache , don't call an Api
      const cachedChildren = this.database.getChildrenFromCache(node);
      if (cachedChildren) {
        // console.log(cachedChildren);
        // Children are already cached, use them
        this.insertCachedChildren(node, cachedChildren);
      }

      // Calling the Api and store the childrens Array's data in the cache
      else {
        this.database.getChildrenFromApi(node.id).subscribe((result: any) => {
          // console.log(result);
          const index = this.data.indexOf(node);

          // console.log(node);
          // console.log(expand);
          // node.isLoading = true;

          // const TempResult = result;
          var namesArray: string[] = [];

          // Loop through the JSON data and push the "name" value to the namesArray 
          result.forEach((item: DynamicFlatNode) => {
            // console.log(item);
            namesArray.push(item.name);
          });
          const Result = namesArray;
          // string[]=[];
          const nodes = Result.map(

            (name: string) => {
              const filteredObjects = result.filter((obj: DynamicFlatNode) => obj.name == name);
              // console.log(obj);
              return new DynamicFlatNode(
                name,
                node.level + 1,
                filteredObjects[0].id,
                filteredObjects[0].IsChildAvailaible
              )
            }
          );
          // Create the object you want to add at the beginning of the array
          const newObj = new DynamicFlatNode("Select All", node.level+1, -1, false);

          // Use unshift to add newObj at the beginning of the nodes array
          nodes.unshift(newObj);

          // console.log(nodes);
          this.data.splice(this.data.indexOf(node) + 1, 0, ...nodes);
          this.database.cacheChildren(node, nodes);
          this.dataChange.next(this.data);
        })
      }
    }
    else {
      const index = this.data.indexOf(node);
      // console.log("asasa");
      let count = 0;
      for (
        let i = index + 1;
        i < this.data.length && this.data[i].level > node.level;
        i++, count++
      ) { }
      this.data.splice(index + 1, count);
    }
    this.dataChange.next(this.data);
    // console.log("Sarthak");
  }


  private insertCachedChildren(node: DynamicFlatNode, cachedChildren: DynamicFlatNode[]) {
    const index = this.data.indexOf(node);

    if (index > -1) {
      // Add cached children to the tree
      this.data.splice(index + 1, 0, ...cachedChildren);
      this.dataChange.next(this.data);
    }
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
  treeData: any;
  constructor(public database: DynamicDatabase, private http: HttpClient) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database, http);
  }
  ngOnInit() {
    this.http.get<DynamicFlatNode[]>(this.ApiUrl1).subscribe((result) => {
      var namesArray: string[] = [];
      // const TempResult=result;
      // Loop through the JSON data and push the "name" value to the namesArray 
      result.forEach((item: DynamicFlatNode) => {
        // console.log(item);
        namesArray.push(item.name);
      });
      // console.log(TempResult);
      // console.log(namesArray);
      const Result = namesArray;


      // Array's Name
      this.database.rootLevelNodes = namesArray;  // Setting The RootLevelNodes to Our Database RootLevelNodes
      this.dataSource.data = this.database.initialData(result);

      this.treeData = this.dataSource.data;  // Initialize treeData
      this.dataSource.data = this.treeData; // Set treeData as the initial data source
      this.TempData1 = this.dataSource.data;
    })
  }


  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.IsChildAvailaible;

  hasChild = (_: number, NodeData: DynamicFlatNode) => NodeData.IsChildAvailaible;



  // Start Search 
  TempData: any;
  TempData1: any;
  searchQuery = "";
  searchboxText="";
  onSearchTextChanged(data:any){
    console.log(data);
  }
  search() {
    if (this.searchQuery == '') {
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
    const filteredNodes = this.treeData.filter((node: DynamicFlatNode) =>
      node.name.toLowerCase().includes(query)
    );

    // Update the tree data with the filtered nodes
    this.dataSource.data = filteredNodes;
  }
  resetSearch(): void {
    this.searchQuery = ''; // Clear the search input
    this.dataSource.data = this.TempData1; // Reset the tree data to its original state
  }
  todoLeafItemSelectionToggle(node: DynamicFlatNode) {

  }
  selectAll = false;
  selectAllNodes() {
    // console.log(node);
  }

  SelectAll(node:any){
    console.log(node);
  }
}
