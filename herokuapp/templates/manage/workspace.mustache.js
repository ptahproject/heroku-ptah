function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"row-fluid manage-workspace\" jca=\"";
  foundHelper = helpers.name;
  stack1 = foundHelper || depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" style=\"height: auto\">\n  <div class=\"menu pull-left\">\n    <h1>Ptah manage</h1>\n    <ul class=\"nav nav-list\" data-place=\"nav\">\n      <li data-navitem=\"manage-ptah-crud\">\n        <a href=\"#\" data-action=\"activate\"\n          data-name=\"ptah-crud\">\n          <i class=\"icon-home icon-white\"></i> Crud</a>\n      </li>\n      <li data-navitem=\"manage-todo\">\n        <a href=\"#\" data-action=\"activate\"\n          data-name=\"todo\">\n          <i class=\"icon-home icon-white\"></i> Todos</a>\n      </li>\n      <li data-navitem=\"manage-ptah-manage-users\">\n        <a href=\"#\" data-action=\"activate\"\n          data-name=\"ptah-manage-users\">\n          <i class=\"icon-home icon-white\"></i> Users</a>\n      </li>\n      <li data-navitem=\"manage-ptah-manage-settings\">\n        <a href=\"#\" data-action=\"activate\"\n          data-name=\"ptah-manage-settings\">\n          <i class=\"icon-home icon-white\"></i> Settings</a>\n      </li>\n    </ul>\n    <hr />\n\n    <ul class=\"nav nav-list\" data-place=\"nav\" data-tag=\"userlist\">\n    </ul>\n  </div>\n  <div class=\"content\" data-place=\"workspace\"></div>\n</div>\n";
  return buffer;}

