using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using ToDoWebApi.Data.DbContexts;
using ToDoWebApi.Models;

namespace ToDoWebApi.GraphQL
{
    [GraphQLDescription("Represents user queries.")]
    [ExtendObjectType("Query")]
    public class UserQuery
    {
        [Authorize]
        [GraphQLDescription("Gets current user's data.")]
        [UseDbContext(typeof(ToDosDbContext))]
        [UseFiltering]
        [UseSorting]
        public IQueryable<ApplicationUser> GetUser(
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            return context.Users.Where(u => u.Id == userId);
        }
    }
}
