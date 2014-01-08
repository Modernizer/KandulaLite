using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SarandibNet.Web.Startup))]
namespace SarandibNet.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
