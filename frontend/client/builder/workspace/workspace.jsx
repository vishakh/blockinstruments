Meteor.startup(function() {

  //contains every element on the board
  blocks = createArray(8,8)

  function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
  }
  HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

  function createArray(length) {
    var arr = new Array(length || 0),
    i = length;

    if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
  }

  var selectedBox;

  Workspace = React.createClass({
    getInitialState: function() {
      return {
        data: this.createGrid()
      }
    },
    createBlock: function(type) {
      var x = parseInt(selectedBox.attr('column'))
      var y = parseInt(selectedBox.attr('row'))
      console.log(type)
      switch (type) {
        case "if":
        var block = $('<th/>',
        {
          class: "ifBlock",
          html: "<p>If</p><p>Then</p>",
          rowspan: "2",
          type: "control",
          name: type
        })
        blocks[y][x] = block
        blocks[y+1][x] = null
        break;
        case "lt":
        var block = $('<th/>',
        {
          class: "ltBlock",
          text: "Less Than",
          type: "comparator",
          name: "LT"
        })
        blocks[y][x] = block
        break;
        case "gt":
        var block = $('<th/>',
        {
          class: "gtBlock",
          text: "Greater Than",
          type: "comparator",
          name: "GT"
        })
        blocks[y][x] = block
        break;
        case "eq":
        var block = $('<th/>',
        {
          class: "eqBlock",
          text: "Equal To",
          type: "comparator",
          name: "EQ"
        })
        blocks[y][x] = block
        break;
        case "neq":
        var block = $('<th/>',
        {
          class: "neqBlock",
          text: "Not Equal To",
          type: "comparator",
          name: "NEQ"
        })
        blocks[y][x] = block
        break;
        case "leq":
        var block = $('<th/>',
        {
          class: "leqBlock",
          text: "Less Than Or Equal To",
          type: "comparator",
          name: "LEQ"
        })
        blocks[y][x] = block
        break;
        case "geq":
        var block = $('<th/>',
        {
          class: "geqBlock",
          text: "Greater Than Or Equal To",
          type: "comparator",
          name: "GEQ"
        })
        blocks[y][x] = block
        break;
        case "and":
        var block = $('<th/>',
        {
          class: "andBlock",
          text: "And",
          type: "booleanOperator",
          name: type
        })
        blocks[y][x] = block
        break;
        case "or":
        var block = $('<th/>',
        {
          class: "orBlock",
          text: "Or",
          type: "booleanOperator",
          name: type
        })
        blocks[y][x] = block
        break;
        case "ab":
        var block = $('<th/>',
        {
          class: "abBlock",
          html: 'Account Balance<input id="parameter"></input>',
          type: "blockData",
          name: "ACCBALANCE"
        })
        blocks[y][x] = block
        break;
        case "gl":
        var block = $('<th/>',
        {
          class: "glBlock",
          html: 'Gas Limit<input id="parameter"></input>',
          type: "blockData",
          name: "GASLIMIT"
        })
        blocks[y][x] = block
        break;
        case "cd":
        var block = $('<th/>',
        {
          class: "cdBlock",
          html: 'Current Difficulty<input id="parameter"></input>',
          type: "blockData",
          name: "DIFFICULTY"
        })
        blocks[y][x] = block
        break;
        case "te":
        var block = $('<th/>',
        {
          class: "teBlock",
          html: '<p>Transfer Ether</p><input id="sender"></input><input id="receiver"></input>',
          type: "function",
          name: type
        })
        blocks[y][x] = block
        break;
        case "con":
        var block = $('<th/>',
        {
          class: "cdBlock",
          html: 'Constant<input id="parameter"></input>',
          type: "variable",
          name: "SCALAR"
        })
        blocks[y][x] = block
        break;
        default:
      }

      this.setState({
        data: blocks
      })
    },
    showOptions: function(element) {
      selectedBox = element
    },
    createGrid: function() {
      var self = this;
      var rows = 8,
      cells = 8,
      count = 0;

      var i, j,
      top = 0,
      left = 0;

      for (j = 0; j < rows; j += 1) {
        for (i = 0; i < cells; i += 1) {
          count += 1;

          var opts = {
            count: count,
            row: j,
            column: i
          }

          var th = $('<th/>', {
            id: "box"+opts.count,
            class:"empty",
            row:opts.row,
            column: opts.column,
            type: "empty"
          })
          blocks[j][i] = th
        }
      }

      return blocks
    },
    render: function() {
      var workspace = $('<div id="workspace"> </div>')
      var fragment = $(document.createDocumentFragment())

      this.state.data.forEach(function(column,y) {
        var tr = $('<tr/>')
        column.forEach(function(cell,x) {
          tr.append(cell)
        })
        workspace.append(tr[0])
      })

      workspace = '<tbody>'+workspace.html()+'</tbody>'

      function createMarkup() { return {__html: workspace}; };
      return (
        <table id="workspace" dangerouslySetInnerHTML={createMarkup()}  />
      )
    },
    componentDidMount: function() {
      var self = this;
      $('.empty').click(function(event) {
        self.showOptions($(this))
      })

      createBlock = this.createBlock
    },
    componentDidUpdate: function() {
      var self = this;
      $('.empty').click(function(event) {
        self.showOptions($(this))
      })
    }
  })

})
