import React from "react";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Compontes
import _ from "lodash";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableFooter from "@material-ui/core/TableFooter";

class MiTablaPaginada extends React.PureComponent {
  onHeaderClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    let col = _.find(this.props.cols, col => col.id == id);
    if ("onHeaderClick" in col && col.onHeaderClick != undefined) {
      col.onHeaderClick();
    }
  };

  onCellClick = (id, data) => {
    let col = _.find(this.props.cols, col => col.id == id);
    if ("onClick" in col && col.onClick != undefined) {
      col.onClick(id, data);
    }
  };

  render() {
    let { cols, rows, rowsPerPage, count, rowsPerPageOptions, page, classes } = this.props;
    cols = cols || [];
    rows = rows || [];
    rowsPerPage = rowsPerPage || 50;
    count = count || 0;
    rowsPerPageOptions = rowsPerPageOptions || [10, 20, 50, 100];
    page = page || 0;

    return (
      <Table>
        <TableHead style={{ backgroundColor: "rgba(0,0,0,0.025)" }}>
          <TableRow>
            {cols.map((col, index) => {
              if ("headerRender" in col && col.headerRender != undefined) {
                return (
                  <TableCell key={index}>
                    <TableSortLabel
                      data-id={col.id}
                      onClick={this.onHeaderClick}
                      active={col.orderBy != undefined}
                      direction={col.orderBy == true ? "desc" : "asc"}
                    >
                      {col.headerRender()}
                    </TableSortLabel>
                  </TableCell>
                );
              }

              return (
                <TableCell padding="dense" key={index}>
                  <TableSortLabel
                    data-id={col.id}
                    onClick={this.onHeaderClick}
                    active={col.orderBy != undefined}
                    direction={col.orderBy == true ? "desc" : "asc"}
                  >
                    {col.label || ""}
                  </TableSortLabel>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((item, indexRow) => {
            let style = {};
            if (this.props.rowsStyle) {
              style = this.props.rowsStyle(item);
            }

            return (
              <TableRow hover key={indexRow} style={{ ...style, height: 49, maxHeight: 49, minHeight: 49 }}>
                {cols.map((col, indexCell) => {
                  if ("render" in col && col.render != undefined) {
                    return (
                      <MiTablaCell
                        data={item}
                        id={col.id}
                        onClick={this.onCellClick}
                        key={indexCell}
                        classes={classes}
                        fit={col.fit || false}
                      >
                        {col.render(item)}
                      </MiTablaCell>
                    );
                  }
                  return (
                    <MiTablaCell
                      key={indexCell}
                      data={item}
                      id={col.id}
                      onClick={this.onCellClick}
                      classes={classes}
                      fit={col.fit || false}
                    >
                      {item[col.id]}
                    </MiTablaCell>
                  );
                })}
              </TableRow>
            );
          })}
          {rows.length < rowsPerPage && (
            <TableRow style={{ height: 49 * (rowsPerPage - rows.length) }}>
              <TableCell padding="dense" />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              // component="div"
              count={count}
              rowsPerPageOptions={rowsPerPageOptions}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                "aria-label": "Página Anterior"
              }}
              nextIconButtonProps={{
                "aria-label": "Siguiente Página"
              }}
              onChangePage={this.props.onChangePage}
              onChangeRowsPerPage={this.props.onChangeRowsPerPage}
              labelRowsPerPage=""
            />
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}

class MiTablaCell extends React.PureComponent {
  onClick = () => {
    this.props.onClick(this.props.id, this.props.data);
  };

  render() {
    return (
      <TableCell padding="dense" onClick={this.onClick}>
        {this.props.children}
      </TableCell>
    );
  }
}

let componente = withStyles(styles)(MiTablaPaginada);
export default componente;
