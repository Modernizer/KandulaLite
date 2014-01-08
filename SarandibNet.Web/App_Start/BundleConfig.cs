using System.Web;
using System.Web.Optimization;

namespace SarandibNet.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));


            //Application styler sheets
            bundles.Add(new StyleBundle("~/Content/themes/ACE/assets/css").Include(
                            "~/Content/themes/ACE/assets/css/bootstrap.css",
                            "~/Content/themes/ACE/assets/css/font-awesome.css",
                            "~/Content/themes/ACE/assets/css/font.css",
                            "~/Content/themes/ACE/assets/css/ace.css",
                            "~/Content/themes/ACE/assets/css/ace-skins.css",
                            "~/Content/themes/ACE/assets/css/select2.css"));

            //Application javascripts
            bundles.Add(new ScriptBundle("~/Content/themes/ACE/assets/js").Include(
                            "~/Content/themes/ACE/assets/js/ace-extra.js",
                            "~/Content/themes/ACE/assets/js/html5shiv.js",
                            "~/Content/themes/ACE/assets/js/respond.js",
                            "~/Content/themes/ACE/assets/js/bootstrap.js",
                            "~/Content/themes/ACE/assets/js/typeahead-bs2.js",
                            "~/Content/themes/ACE/assets/js/prettify.js",
                            "~/Content/themes/ACE/assets/js/ace-elements.js",
                            "~/Content/themes/ACE/assets/js/ace.js",
                            "~/Content/themes/ACE/assets/js/select2.js",
                            "~/Content/application/js/bootbox.js",
                            "~/Content/application/js/dropzone.js",
                            "~/Content/application/js/moment.js",
                            "~/Content/application/js/highcharts.js",
                            "~/Content/application/js/exporting.js"));


            //Thirdparty javascripts
            bundles.Add(new ScriptBundle("~/Content/thirdParty/js").Include(
                            "~/Content/thirdParty/js/bootbox.js",
                            "~/Content/thirdParty/js/dropzone.js",
                            "~/Content/thirdParty/js/moment.js",
                            "~/Content/thirdParty/js/highcharts.js",
                            "~/Content/thirdParty/js/exporting.js"));
        }
    }
}
