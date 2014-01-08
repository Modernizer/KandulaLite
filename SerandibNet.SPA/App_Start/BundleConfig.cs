using System.Web;
using System.Web.Optimization;

namespace SerandibNet.SPA
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
      
            bundles.Add(new ScriptBundle("~/bundles/ajaxlogin").Include(
                "~/Scripts/app/ajaxlogin.js"));

            bundles.Add(new ScriptBundle("~/bundles/menuhandler").Include("~/Scripts/app/menuhandler.js"));
            bundles.Add(new ScriptBundle("~/bundles/utils").Include("~/Scripts/app/utils.js"));


            bundles.Add(new ScriptBundle("~/bundles/todo").Include(
                "~/Scripts/app/todo.bindings.js",
                "~/Scripts/app/todo.datacontext.js",
                "~/Scripts/app/todo.model.js",
                "~/Scripts/app/todo.viewmodel.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                            "~/Content/themes/base/css/bootstrap.css",
                            "~/Content/themes/base/css/font-awesome.css",
                            "~/Content/themes/base/css/font.css",
                            "~/Content/themes/base/css/ace.css",
                            "~/Content/themes/base/css/ace-skins.css",
                            "~/Content/themes/base/css/ace-rtl.css",
                            "~/Content/themes/base/css/select2.css",
                            "~/Content/themes/base/css/kendo.common.css",
                            "~/Content/themes/base/css/kendo.default.css",
                            "~/Content/odata-query-builder.css",
                            "~/html5/Content/app-editor.css"));

            bundles.Add(new ScriptBundle("~/Content/themes/base/js").Include(
                            "~/Content/themes/base/js/ace-extra.js",
                            "~/Content/themes/base/js/html5shiv.js",
                            "~/Content/themes/base/js/respond.js",
                            "~/Content/themes/base/js/bootstrap.js",
                            "~/Content/themes/base/js/typeahead-bs2.js",
                            "~/Content/themes/base/js/prettify.js",
                            "~/Content/themes/base/js/ace-elements.js",
                            "~/Content/themes/base/js/ace.js",
                            "~/Content/themes/base/js/select2.js",
                            "~/Content/themes/base/js/bootbox.js",
                            "~/Content/themes/base/js/dropzone.js",
                            "~/Content/themes/base/js/moment.js",
                            "~/html5/Scripts/jquery-{version}.js",
                            "~/html5/Scripts/knockout-{version}.js",
                            "~/html5/Scripts/kendo/2012.3.1315/kendo.all.js",
                            "~/Content/themes/base/js/highcharts.js",
                            "~/Content/themes/base/js/exporting.js",
                            "~/Scripts/jquery-2.0.0.js",
                            "~/Scripts/datajs-1.1.1.js",
                            "~/Scripts/odata-query-builder.js"
                            
                            ));
        }
    }
}