Meteor.startup(function() {
  Router.route('/', function () {
    this.render('builder');
  })

  Template.builder.rendered = function() {
    var Navbar = React.createClass({
      render: function() {
        return (
          <nav id="navbar">

          </nav>
        )
      }
    })


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
    //contains every element on the board
    var blocks = createArray(8,8)

    var selectedBox;
    var createBlock;

    var Workspace = React.createClass({
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
            text: "If Block",
            rowspan: "2",
            type: "if"
          })
          blocks[y][x] = block
          blocks[y+1][x] = null
          break;
          case "lt":
          var block = $('<th/>',
          {
            class: "ltBlock",
            text: "Less Than",
            type: "lt"
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

        this.state.data.forEach(function(column,x) {
          var tr = $('<tr/>')
          column.forEach(function(cell,y) {
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

    var Builder = React.createClass({
      createBlock: function(event) {
        this.refs.workspace.createBlock(event.target.getAttribute("name"))
      },
      render: function(){
        return (
          <div id="builder-page" className="page">
            <Navbar/>
            <Sidebar createBlock={this.createBlock}/>
            <Workspace ref="workspace"/>
          </div>
        )
      }
    })

    React.render(<Builder/>, document.body)
  }
})
