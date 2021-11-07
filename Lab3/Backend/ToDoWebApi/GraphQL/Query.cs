using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using ToDoWebApi.Data.DbContexts;
using ToDoWebApi.GraphQL.Users;
using ToDoWebApi.Models;
using ToDoWebApi.Services;

namespace ToDoWebApi.GraphQL
{
    [GraphQLDescription("Represents user queries.")]
    public class Query
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

        [Authorize]
        [GraphQLDescription("Gets current user's notes.")]
        [UseDbContext(typeof(ToDosDbContext))]
        [UseFiltering]
        [UseSorting]
        public IQueryable<ToDoNote> GetNote(
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            return context.Notes
                .Where(n => n.UserId == userId);
        }
    }
}
