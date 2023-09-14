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
  @Input() ApiUrl: string="";
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
          this.http.get(this.ApiUrl).subscribe((result)=>{
            this.dataSource.data =<any> result;
          })
        }
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
