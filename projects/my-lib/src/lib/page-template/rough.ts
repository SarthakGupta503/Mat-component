import {CollectionViewer, SelectionChange, DataSource} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable, Input} from '@angular/core';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTreeModule} from '@angular/material/tree';
import { HttpClient } from '@angular/common/http';
import { MyLibService } from '../my-lib.service';

/* Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(
    public item: string,
    public level = 1,
    public expandable = false,
    public isLoading = false,
  ) {}
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({providedIn: 'root'})
export class DynamicDatabase {
  constructor(private http:HttpClient,private dataservice:MyLibService){}
  dataMap = new Map<string, string[]>([
    // ['Fruits', ['Apple', 'Orange', 'Banana']],
    // ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    // ['Apple', ['Fuji', 'Macintosh']],
    // ['Onion', ['Yellow', 'White', 'Purple']],
  ]);

  // rootLevelNodes: string[] = ['Fruits', 'Vegetables'];
  rootLevelNodes: string[] = [];


  
  /* Initial data from database */
  initialData(): DynamicFlatNode[] {
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }
 
  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }
  // setChildren(node:string){
    
  //   // this.dataMap.set();
  // }
  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
  getChildrenFromApi(node:string){
    return this.http.get('http://localhost:3000/'+ node);
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
    private http:HttpClient
  ) {}
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

  disconnect(collectionViewer: CollectionViewer): void {}    

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
    }
  }
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    if (expand && node.expandable && !node.isLoading) {
      node.isLoading = true;
      this._database.getChildrenFromApi(node.item).subscribe((result:any) => {
        const Result=result;
        // string[]=[];
        const nodes = Result.map(
          (name:any) =>
            new DynamicFlatNode(
              name,
              node.level + 1,
              this._database.isExpandable(name)
            )
        );
        this.data.splice(this.data.indexOf(node) + 1, 0, ...nodes);
        this.dataChange.next(this.data);
        node.isLoading = false;
      });
    }
  }
  
  // toggleNode(node: DynamicFlatNode, expand: boolean) {
  //   node.expandable=true;
  //   if (expand) {
  //     node.isLoading = true;
  //     this.http.get<DynamicFlatNode[]>(`http://localhost:3000/${node.item}`).subscribe(
  //       (children) => {
  //         const nodes = children.map(
  //           (item) => new DynamicFlatNode(item.item, item.level, item.expandable)
  //         );
  //         const index = this.data.indexOf(node);
  //         this.data.splice(index + 1, 0, ...nodes);
  //         this.dataChange.next(this.data);
  //         node.isLoading = false;
  //       },
  //       (error) => {
  //         console.error('Error fetching children:', error);
  //         node.isLoading = false;
  //       }

  //     );
  //   }
  // }
  /**
   * Toggle the node, remove from display list
   */
  // toggleNode1(node: DynamicFlatNode, expand: boolean) {
  //   const children = this._database.getChildren(node.item);
  //   const index = this.data.indexOf(node);
  //   if (!children || index < 0) {
  //     // If no children, or cannot find the node, no op
  //     return;
  //   }

  //   node.isLoading = true;

  //   setTimeout(() => {
  //     if (expand) {
  //       const nodes = children.map(
  //         name => new DynamicFlatNode(name, node.level + 1, this._database.isExpandable(name)),
  //       );
  //       this.data.splice(index + 1, 0, ...nodes);
  //     } else {
  //       let count = 0;
  //       for (
  //         let i = index + 1;
  //         i < this.data.length && this.data[i].level > node.level;
  //         i++, count++
  //       ) {}
  //       this.data.splice(index + 1, count);
  //     }

  //     // notify the change
  //     this.dataChange.next(this.data);
  //     node.isLoading = false;
  //   }, 1000);
  // }
}

/**
 * @title Tree with dynamic data
 */

@Component({
  selector: 'lib-page-template',
  templateUrl: './page-template.component.html',
  styleUrls: ['./page-template.component.css']
})
export class PageTemplateComponent {
  
  @Input() ApiUrl: string="";
  constructor(public database: DynamicDatabase,private http:HttpClient) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database,http);
  

  }
  ngOnInit(){  
    this.http.get<DynamicFlatNode[]>(this.ApiUrl).subscribe((result)=>{
      this.database.rootLevelNodes=<any>result;
      this.dataSource.data = this.database.initialData();
    })
  }


  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  //  GetData(node:DynamicFlatNode){
    // const NodeName=node.item;
    // this.http.get(`http://localhost:3000/${node.item}`).subscribe((result)=>{
      // console.log(result.children);

      // console.log(result.name);
        // Nodeschildren=result.;
      //  this.database.dataMap.set(NodeName,)
    // })
    // this.dataservice.toggleNode(node,true);
    
  // }
}

   <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
    <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
      <button mat-icon-button disabled></button>
      {{node.item}}
    </mat-tree-node>
    <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
      <button mat-icon-button
              [attr.aria-label]="'Toggle ' + node.item" matTreeNodeToggle>
        <mat-icon class="mat-icon-rtl-mirror">
          {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
        </mat-icon>
      </button>
      {{node.item}}
      <mat-progress-bar *ngIf="node.isLoading"
                        mode="indeterminate"
                        class="example-tree-progress-bar"></mat-progress-bar>
    </mat-tree-node>
  </mat-tree>
  