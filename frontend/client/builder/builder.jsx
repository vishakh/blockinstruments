Meteor.startup(function() {
  Router.route('/', function () {
    this.render('builder');
  })

  Template.builder.rendered = function() {
    var Navbar = React.createClass({
      render: function() {
        return (
          <nav id="navbar">
            <h1>Block Instruments</h1>
          </nav>
        )
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
