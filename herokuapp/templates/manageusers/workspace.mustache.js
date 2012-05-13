function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials.row, 'row', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  return buffer;}

  buffer += "<div class=\"row-fluid\">\n  <div class=\"page-header\">\n    <h1>Manage users</h1>\n  </div>\n\n  <div class=\"span11\">\n    <form data-form=\"users-listing\">\n      <table class=\"table table-striped\">\n        <thead>\n          <tr>\n            <th>&nbsp;</th>\n            <th>Name</th>\n            <th>Login/Email</th>\n            <th>Role</th>\n            <th>Suspended</th>\n            <th>Validated</th>\n            <th>Joined</th>\n            <th>Online</th>\n          </tr>\n        </thead>\n\n        <tbody data-place=\"users-listing\">\n          ";
  foundHelper = helpers.users;
  stack1 = foundHelper || depth0.users;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </tbody>\n      </table>\n\n      <div class=\"\" jca=\"ui/pager\">\n      </div>\n\n      <div class=\"form-actions listing-actions\">\n        <a href=\"#\" class=\"btn btn-danger\" data-action=\"remove\">Remove</a>\n        <a href=\"#\" class=\"btn btn-info\" data-action=\"create\">Create</a>\n      </div>\n    </form>\n  </div>\n</div>\n";
  return buffer;}

