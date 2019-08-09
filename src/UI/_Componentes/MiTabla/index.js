import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { styles, toolbarStyles } from "./styles";
import classNames from "classnames";

import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import _ from "lodash";
import { Typography } from "@material-ui/core";

/*
Props esperadas:
->columns - (obligatorio) - Array columnas - Ej.: { id: 'concepto', type: 'string', numeric: false, disablePadding: true, label: 'Concepto' },
->rows - (obligatorio) - Array de objetos con respectivas columnas
->orderBy - (obligatorio) - id columna por la cual ordenar inicialmente
->order (defecto 'desc') - Sentido para ordenar
->getFilasSeleccionadas - Función que obtendrá las un array de filas y otro de los id de aquellas seleccionadas
->customCell - Funcion que retornara el contenido de la columna del tipo  type: 'customCell', y estará al último
->rowType - (defecto 'Concepto') - String que dice el tipo de filas que hay 
->noCheck - Boolean que determina si la grilla muestra los checks o no
*/

const desc = (a, b, orderBy, orderType, cols) => {
  let col = _.find(cols, col => col.id == orderBy);
  if (col) {
    if ("orderBy" in col && col.orderBy != undefined) {
      return col.orderBy(a, b);
    }
  }

  switch (orderType) {
    case "date": {
      try {
        let dateA = a[orderBy].split("/");
        let dateB = b[orderBy].split("/");

        dateB = new Date(dateB[1] + "/" + dateB[0] + "/" + dateB[2]);
        dateA = new Date(dateA[1] + "/" + dateA[0] + "/" + dateA[2]);
        if (dateB < dateA) {
          return -1;
        }
        if (dateB > dateA) {
          return 1;
        }
        return 0;
      } catch (ex) {
        console.log(ex);
        return 0;
      }
    }

    case "datetime": {
      try {
        let partesA = a[orderBy].split(" ");
        let parteDiaA = partesA[0].split("/");
        let partesHoraA = partesA[1].split(":");

        let partesB = b[orderBy].split(" ");
        let parteDiaB = partesB[0].split("/");
        let partesHoraB = partesB[1].split(":");

        let dateA = new Date(parteDiaA[1] + "/" + parteDiaA[0] + "/" + parteDiaA[2]);
        dateA.setHours(partesHoraA[0]);
        dateA.setMinutes(partesHoraA[1]);

        let dateB = new Date(parteDiaB[1] + "/" + parteDiaB[0] + "/" + parteDiaB[2]);
        dateB.setHours(partesHoraB[0]);
        dateB.setMinutes(partesHoraB[1]);

        if (dateB < dateA) {
          return -1;
        }
        if (dateB > dateA) {
          return 1;
        }
        return 0;
      } catch ({ message }) {
        console.log(message);
        return 0;
      }
    }

    default: {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }
  }
};

const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

const getSorting = (order, orderBy, orderType, columns) => {
  return order === "desc" ? (a, b) => desc(a, b, orderBy, orderType, columns) : (a, b) => -desc(a, b, orderBy, orderType, columns);
};

class EnhancedTableHead extends React.Component {
  createSortHandler = (property, colType) => event => {
    this.props.onRequestSort(event, property, colType);
  };

  render() {
    const { classes } = this.props;
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;
    const check = this.props.check || false;

    return (
      <TableHead className={classes.tableHead}>
        <TableRow>
          {check == true && (
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                className={classes.tableCell}
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
          )}
          {this.props.columns.map((row, key) => {
            if (row.hidden === true) return null;
            return (
              <TableCell
                className={classes.tableCell}
                key={row.id}
                numeric={row.numeric || false}
                padding={"dense"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <TableSortLabel
                  className={classes.tableCell}
                  active={orderBy === row.id}
                  direction={order}
                  onClick={this.createSortHandler(row.id, row.type)}
                >
                  {row.label}
                </TableSortLabel>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

EnhancedTableHead = withStyles(toolbarStyles)(EnhancedTableHead);

class MiTabla extends React.Component {
  constructor(props) {
    super(props);

    var data = (props.rows || []).map((row, key) => {
      row.id = key;
      return row;
    });

    this.state = {
      order: this.props.order || "desc",
      orderBy: this.props.orderBy,
      orderType: "string",
      selected: this.props.selected || [],
      data: data,
      page: this.props.page || 0,
      rowsPerPage: this.props.rowPerPage || 10
    };
  }

  componentWillReceiveProps(nextProps) {
    var data = nextProps.rows.map((row, key) => {
      row.id = key;
      return row;
    });

    if (this.state.data != data) {
      this.setState({
        data: data
      });
    }
  }

  handleRequestSort = (event, property, colType) => {
    const orderBy = property;
    const orderType = colType;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy, orderType });
  };

  handleSelectAllClick = event => {
    let newSelected = [];
    if (event.target.checked) {
      newSelected = this.state.data.map(n => n.id);
      this.setState({ selected: newSelected });
    } else {
      this.setState({ selected: newSelected });
    }

    if (this.props.getFilasSeleccionadas) this.props.getFilasSeleccionadas(this.state.data, newSelected);
  };

  handleClick = (event, id) => {};

  handleCheckboxClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    this.setState({ selected: newSelected });
    this.props.onFilasSeleccionadasChange && this.props.onFilasSeleccionadasChange(this.state.data, newSelected);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  getLabelDisplayedRows = _ref => {
    var from = _ref.from,
      to = _ref.to,
      count = _ref.count;
    return ""
      .concat(from, "-")
      .concat(to, " de ")
      .concat(count);
  };

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, orderType, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const check = this.props.check || false;

    return (
      <div className={classNames(classes.root, this.props.className)}>
        <div className={classes.tableWrapper}>
          <Table aria-labelledby="tableTitle">
            <EnhancedTableHead
              columns={this.props.columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              orderType={orderType}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              check={check}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy, orderType, this.props.columns))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, index) => {
                  const isSelected = this.isSelected(n.id);

                  return (
                    <MiRow
                      columns={this.props.columns}
                      key={index}
                      check={check}
                      data={n}
                      classes={classes}
                      onClick={this.handleClick}
                      onCheckboxClick={this.handleCheckboxClick}
                      isSelected={isSelected}
                      // customCell={this.props.customCell}
                    />
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (this.props.rowHeight || 49) * emptyRows }}>
                  <TableCell colSpan={6} padding="dense" />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPageOptions={[5, 10, 20, 50]}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Página Anterior"
          }}
          nextIconButtonProps={{
            "aria-label": "Siguiente Página"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          labelRowsPerPage={''}
          labelDisplayedRows={this.getLabelDisplayedRows}
        />
      </div>
    );
  }
}

class MiRow extends React.PureComponent {
  onClick = event => {
    this.props.onClick && this.props.onClick(event, this.props.data.id);
  };

  onCheckboxClick = event => {
    this.props.onCheckboxClick && this.props.onCheckboxClick(event, this.props.data.id);
  };

  render() {
    const check = this.props.check || false;
    const classes = this.props.classes;
    const columns = this.props.columns;
    return (
      <TableRow
        hover
        onClick={this.onClick}
        role="checkbox"
        aria-checked={this.props.isSelected || false}
        tabIndex={-1}
        key={this.props.data.id}
        selected={this.props.isSelected || false}
      >
        {check == true && (
          <TableCell padding="checkbox">
            <Checkbox checked={this.props.isSelected || false} onClick={this.onCheckboxClick} />
          </TableCell>
        )}
        {Object.keys(this.props.data).map((cell, key) => {
          const col = _.find(columns, col => {
            return col.id == cell;
          });
          if (col) {
            if (col.hidden === true) return null;
          }

          return (
            cell != "id" && (
              <TableCell className={classes.tableCell} key={cell} padding="dense">
                <Typography variant="body1">{this.props.data[cell]}</Typography>
              </TableCell>
            )
          );
        })}
      </TableRow>
    );
  }
}

MiTabla.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MiTabla);
