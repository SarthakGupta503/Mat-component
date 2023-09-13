import { CollectionViewer, SelectionChange, DataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatProgressBar } from '@angular/material/progress-bar';
import { HttpClient } from '@angular/common/http';
// import { MyLibService } from';
import { MyLibService } from '../my-lib.service';
export class DynamicFlatNode {
  constructor(
     public item: string,
     public level = 1,
     public expandable = false,
     public isLoading = false,
  ) { }
}



// //Preparing the database in the 
@Injectable({providedIn: 'root'})
export class DynamicDatabase {
  // dataMap = new Map<string, string[]>([
    // ['Fruits', ['Apple', 'Orange', 'Banana']],
    // ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    // ['Apple', ['Fuji', 'Macintosh']],
    // ['Onion', ['Yellow', 'White', 'Purple']], 
  // ]);
  constructor(private apiService: MyLibService) {}

  getChildren(node: string) {
    // Call your API service to fetch data for the node
    this.apiService.fetchNodeData(node).subscribe((result)=>{
      console.log(result);
    });
  }

  isExpandable(node: string){
    //
    // Determine if the node is expandable based on your API response
    // For example, check if it has children in the response.
  }

  rootLevelNodes: string[] = ['Fruits', 'Vegetables'];

  /** Initial data from database */
  initialData(): DynamicFlatNode[] {
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }
}


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
  ) { }

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

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    const children = this._database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

    setTimeout(() => {
      if (expand) {
        const nodes = children.map(
          name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)),
        );
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > node.level;
          i++, count++
        ) { }
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
      node.isLoading = false;
    }, 1000);
  }
}
// This is code written in material ui , where the data is coming other than api?
// I have export there is an error associated with export class PageTemplateComponent 
// Class is using Angular features but is not decorated.Please add an explicit Angular decorator.
@Component({
  selector: 'lib-page-template',
  templateUrl: './page-template.component.html',
  styleUrls: ['./page-template.component.css']
})

export class PageTemplateComponent {
  title = 'App';
  searchkey: string = "";
  data: number = 1;
  url = "http://localhost:3000/Columns";
  url1="http://localhost:300/Data"
  // url1 = "https://sisomali.datamanager.dataforall.org/services/serviceQuery/2209";
  ngOnInit(): void {
    this.getSelectionValue();
  }
  getSelectionValue() {
    this.http.get(this.url).subscribe((result) => {
      console.log(result);
      
      // this.rowData=result;
    });
  }

  constructor(database: DynamicDatabase,public http: HttpClient) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database);

    this.dataSource.data = database.initialData();
  }

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

}
