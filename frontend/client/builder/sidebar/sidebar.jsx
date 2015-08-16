Meteor.startup(function() {

  Sidebar = React.createClass({
    render: function() {
      createBlock = this.props.createBlock
      var controls = (
        <ul>
          <li id="controls">
            Controls <i className='fa fa-chevron-down'></i>
          <ul className="submenu">
            <li name="if" onClick={createBlock}>If</li>
          </ul>
        </li>
      </ul>
    )

    var comparators = (
      <ul>
        <li id="comparators">
          Comparators <i className='fa fa-chevron-down'></i>
        <ul className="submenu">
          <li name="lt" onClick={createBlock}>Less Than</li>
          <li>Greater Than</li>
          <li>Equal To</li>
          <li>Not equal To</li>
          <li>Less Than Or Equal</li>
          <li>Greater Than Or Equal</li>
        </ul>
      </li>
    </ul>
  )

  var logic = (
    <ul>
      <li id="logic">
        Boolean Logic <i className='fa fa-chevron-down'></i>
      <ul className="submenu">
        <li>And</li>
        <li>Or</li>
      </ul>
    </li>
  </ul>
)

var blockData = (
  <ul>
    <li id="logic">
      Block Data <i className='fa fa-chevron-down'></i>
    <ul className="submenu">
      <li>Account Balance</li>
      <li>Gas Price</li>
      <li>Current Difficulty</li>
    </ul>
  </li>
</ul>
)

return (
  <nav id="sidebar">
    {controls}
    {comparators}
    {logic}
    {blockData}
  </nav>
)
}
})
})
