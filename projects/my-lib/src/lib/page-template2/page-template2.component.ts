import { Component, Input } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MyLibService } from '../my-lib.service';
interface GeneralNode {
  name: string;
  children?: GeneralNode[];
  subgroup:boolean;
}

const TREE_DATA: GeneralNode[] = [
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Component({
  selector: 'lib-page-template2',
  templateUrl: './page-template2.component.html',
  styleUrls: ['./page-template2.component.css']
})
export class PageTemplate2Component {
  @Input() ApiUrl2: string="";
  @Input() OnDemand: boolean=false;
  private _transformer = (node: GeneralNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };
  
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private apiservice:MyLibService,private http:HttpClient) {}
      ngOnInit(){
        if(this.OnDemand==false){
          this.http.get(this.ApiUrl2).subscribe((result)=>{
            this.dataSource.data =<any> result;
          })
        }
        // Ondemand Data Coming 
        else{
          
        }
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  // loadChildren(node: ExampleFlatNode): void {
  //   if (node.expandable && !this.treeControl.isExpanded(node)) {
  //     // You can fetch data from the API here based on the node's data.
  //     // For demonstration purposes, we'll just add dummy data.
  //     const dummyData = [
  //       {
  //         name: 'Child 1',
  //         children: [],
  //       },
  //       {
  //         name: 'Child 2',
  //         children: [],
  //       },
  //     ];
  
  //     // Add the new data to the tree
  //     this.treeControl.expand(node);
  //     this.dataSource.data = this.dataSource.data.map((item) => {
  //       if (item === node) {
  //         return {
  //           ...item,
  //           children: dummyData,
  //         };
  //       }
  //       return item;
  //     });
  //   }
  // }
  
  searchText: string = '';
  isTreeView:string="NO";
  // onSearchTextChanged(searchText: string) {
  //   this.searchText = searchText;

  //   if (this.isTreeView === 'NO')
  //     this.dataSource.data = this.filterSubgroup(TREE_DATA, searchText);
  //   else
  //     this.dataSource.data = this.filterNodes(TREE_DATA, searchText);
  // }

  // filterSubgroup(nodes: GeneralNode[], searchText: string): GeneralNode[] {
  //   if (searchText === '') {
  //     // If the search box is empty, return all data
  //     return nodes;
  //   }

  //   const filteredSubgroup: GeneralNode[] = [];

  //   for (const node of nodes) {
  //     if (node.subgroup) {
  //       const filteredSubgroupNodes = node.subgroup.filter(subgroupNode =>
  //         subgroupNode.name.toLowerCase().includes(searchText.toLowerCase())
  //       );

  //       if (filteredSubgroupNodes.length > 0) {
  //         const parentNode = { ...node, subgroup: filteredSubgroupNodes };
  //         filteredSubgroup.push(parentNode);
  //       }
  //     }
  //   }

  //   return filteredSubgroup;
  // }

  // filterNodes(nodes: GeneralNode[], searchText: string): GeneralNode[] {
  //   const filteredNodes: GeneralNode[] = [];

  //   for (const node of nodes) {
  //     if (node.name.toLowerCase().includes(searchText.toLowerCase())) {
  //       filteredNodes.push(node);
  //     }

  //     if (node.subgroup) {
  //       const filteredChildren = this.filterNodes(node.subgroup, searchText);
  //       if (filteredChildren.length > 0) {
  //         const parentNode = { ...node, subgroup: filteredChildren };
  //         if (!filteredNodes.find(n => n.name === parentNode.name)) {
  //           filteredNodes.push(parentNode);
  //         }
  //       }
  //     }
  //   }

  //   return filteredNodes;
  // }
  
}
