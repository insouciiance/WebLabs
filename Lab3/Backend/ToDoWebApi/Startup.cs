using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AspNetCoreRateLimit;
using GraphQL.Server.Ui.Voyager;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ToDoWebApi.Data.DbContexts;
using ToDoWebApi.GraphQL;
using ToDoWebApi.GraphQL.ErrorFilters;
using ToDoWebApi.GraphQL.ToDos;
using ToDoWebApi.GraphQL.Users;
using ToDoWebApi.Models;
using ToDoWebApi.Services;

namespace ToDoWebApi
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }
        public IWebHostEnvironment Environment { get; set; }

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            string corsOrigin = Environment.IsDevelopment()
                ? @"http://localhost:8080"
                : @"https://insouciiance-todo.azurewebsites.net";

            services.AddCors(options =>
            {
                options.AddPolicy("Default",
                    builder => builder
                        .WithOrigins(corsOrigin)
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });

            services.AddPooledDbContextFactory<ToDosDbContext>(options =>
            {
                string connectionString = Environment.IsDevelopment() ?
                    Configuration["LocalConnection"] :
                    Configuration["DefaultConnection"];

                options.UseSqlServer(connectionString);
            });

            services.AddScoped<JwtTokenCreator>();

            services.AddScoped(p => p.GetRequiredService<IDbContextFactory<ToDosDbContext>>().CreateDbContext());

            services
                .AddIdentity<ApplicationUser, IdentityRole>(options =>
                {
                    options.Password.RequiredLength = 6;
                    options.Password.RequireDigit = true;
                    options.Password.RequireLowercase = true;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireNonAlphanumeric = true;
                })
                .AddEntityFrameworkStores<ToDosDbContext>();

            string signingKeyPhrase = Configuration["SigningKeyPhrase"];
            SymmetricSecurityKey signingKey = new(Encoding.UTF8.GetBytes(signingKeyPhrase));

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(config =>
                {
                    config.RequireHttpsMetadata = true;
                    config.SaveToken = true;
                    config.TokenValidationParameters = new TokenValidationParameters
                    {
                        IssuerSigningKey = signingKey,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true
                    };
                });

            services.AddHttpContextAccessor();

            services
                .AddGraphQLServer()
                .AddQueryType(d => d.Name("Query"))
                    .AddTypeExtension<UserQuery>()
                    .AddTypeExtension<ToDoNoteQuery>()
                .AddMutationType(d => d.Name("Mutation"))
                    .AddTypeExtension<UserMutation>()
                    .AddTypeExtension<ToDoNoteMutation>()
                    .AddTypeExtension<ToDoCheckboxMutation>()
                .AddSubscriptionType<Subscription>()
                .AddType<ApplicationUserType>()
                .AddType<RegisterUserInputType>()
                .AddType<LoginUserPayloadType>()
                .AddType<LoginUserPayloadType>()
                .AddType<LogoutUserPayloadType>()
                .AddType<ToDoNoteType>()
                .AddType<ToDoNoteInputType>()
                .AddType<ToDoNotePayloadType>()
                .AddType<ToDoNotePutInputType>()
                .AddType<ToDoNotePutPayloadType>()
                .AddType<ToDoNoteDeleteInputType>()
                .AddType<ToDoNoteDeletePayloadType>()
                .AddType<ToDoCheckboxType>()
                .AddType<ToDoCheckboxInputType>()
                .AddType<ToDoCheckboxPayloadType>()
                .AddType<ToDoCheckboxPutInputType>()
                .AddType<ToDoCheckboxPutPayloadType>()
                .AddType<ToDoCheckboxDeleteInputType>()
                .AddType<ToDoCheckboxDeletePayloadType>()
                .AddType<OnNotesUpdateMessageType>()
                .AddFiltering()
                .AddSorting()
                .AddInMemorySubscriptions()
                .AddAuthorization();

            services.AddErrorFilter<GraphQLErrorFilter>();

            services.AddOptions();

            services.AddMemoryCache();

            services.AddInMemoryRateLimiting();

            services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

            services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseGraphQLVoyager(new VoyagerOptions
                {
                    GraphQLEndPoint = "/graphql"
                }, "/graphql-voyager");
            }

            app.UseWebSockets();

            app.UseCors("Default");

            app.UseRouting();

            app.UseIpRateLimiting();

            app.UseAuthentication();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGraphQL();
            });
        }
    }
}
