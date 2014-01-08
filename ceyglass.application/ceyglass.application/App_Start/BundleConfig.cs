using System.Web;
using System.Web.Optimization;

namespace ceyglass.application
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                        "~/Scripts/knockout-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/ajaxlogin").Include(
                "~/Scripts/app/ajaxlogin.js"));

            bundles.Add(new ScriptBundle("~/bundles/todo").Include(
                "~/Scripts/app/todo.bindings.js",
                "~/Scripts/app/todo.datacontext.js",
                "~/Scripts/app/todo.model.js",
                "~/Scripts/app/todo.viewmodel.js"));



            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/Site.css",
                "~/Content/TodoList.css"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));

            /*ERP Style sheets*/
            bundles.Add(new StyleBundle("~/Content/application/css").Include(
                            "~/Content/application/css/bootstrap.css",
                            "~/Content/application/css/font-awesome.css",
                            "~/Content/application/css/font.css",
                            "~/Content/application/css/ace.css",
                            "~/Content/application/css/ace-skins.css",
                            "~/Content/application/css/select2.css"));

            /*ERP scripts*/
            bundles.Add(new ScriptBundle("~/Content/application/js").Include(
                            "~/Content/application/js/ace-extra.js",
                            "~/Content/application/js/html5shiv.js",
                            "~/Content/application/js/respond.js",
                            "~/Content/application/js/bootstrap.js",
                            "~/Content/application/js/typeahead-bs2.js",
                            "~/Content/application/js/prettify.js",
                            "~/Content/application/js/ace-elements.js",
                            "~/Content/application/js/ace.js",
                            "~/Content/application/js/select2.js",
                            "~/Content/application/js/bootbox.js",
                            "~/Content/application/js/dropzone.js",
                            "~/Content/application/js/moment.js",
                            "~/Content/application/js/highcharts.js",
                            "~/Content/application/js/exporting.js"));

            bundles.Add(new ScriptBundle("~/Scripts/erp/index").Include(
              "~/Scripts/erp/indexview.js"));

            bundles.Add(new ScriptBundle("~/Scripts/erp/login").Include(
               "~/Scripts/erp/loginview.js"));

            bundles.Add(new ScriptBundle("~/Scripts/erp/callquotation").Include(
             "~/Scripts/erp/call_quotation.js"));

        }
    }
}