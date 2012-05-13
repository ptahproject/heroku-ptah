function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"row-fluid\">\n  <h2>Chat: ";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</h2>\n\n  <div class=\"span12\">\n    <div class=\"messages\" style=\"height: 400px; overflow: auto\"\n      data-tag=\"messages\">\n    </div>\n    <div data-entry=\"entry\">\n      Comment:<br />\n      <textarea rows=\"1\" style=\"width: 95%\" name=\"message\"></textarea>\n    </div>\n  </div>\n</div>\n";
  return buffer;}

