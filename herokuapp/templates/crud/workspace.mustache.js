function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <tr>\n            <td>\n              <h2>\n                <a href=\"javascript:void(0)\"\n                  data-action=\"model\" data-uri=\"";
  foundHelper = helpers.uri;
  stack1 = foundHelper || depth0.uri;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "uri", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a>\n              </h2>\n              <p>";
  foundHelper = helpers.description;
  stack1 = foundHelper || depth0.description;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "description", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</p>\n            </td>\n          </tr>\n        ";
  return buffer;}

  buffer += "<div class=\"row-fluid\" data-tag=\"models\">\n  <div class=\"page-header\">\n    <h1>Models</h1>\n  </div>\n\n  <div class=\"span12\">\n    <table class=\"table table-striped\">\n      <tbody data-place=\"models\">\n        ";
  foundHelper = helpers.models;
  stack1 = foundHelper || depth0.models;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </tbody>\n    </table>\n  </div>\n</div>\n\n<div class=\"row-fluid\" data-tag=\"model\" style=\"display:none\">\n  <div class=\"page-header\">\n    <div class=\"pull-right\">\n      <a href=\"javascript:void(0)\" class=\"btn btn-primary\"\n        data-action=\"add\">Add</a>\n      <a href=\"javascript:void(0)\" class=\"btn\"\n        data-action=\"list_models\">List models</a>\n    </div>\n    <h1 data-tag=\"modelname\">test</h1>\n    <p data-tag=\"modeldesc\">";
  foundHelper = helpers.description;
  stack1 = foundHelper || depth0.description;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "description", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</p>\n  </div>\n\n  <div class=\"span12\">\n    <table class=\"table table-striped\">\n      <thead data-tag=\"modelheaders\">\n      </thead>\n      <tbody data-tag=\"modeldata\">\n      </tbody>\n    </table>\n    <div data-tag=\"pager\"></div>\n  </div>\n</div>\n";
  return buffer;}

