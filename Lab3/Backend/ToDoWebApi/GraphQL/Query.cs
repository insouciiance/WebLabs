using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Data;
using Microsoft.AspNetCore.Authorization;
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
        public IQueryable<ApplicationUser> GetUser([Service] ToDosDbContext context)
        {
            return context.Users;
        }

        [Authorize]
        public IQueryable<ToDoNote> GetNotes(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext.User.Claims.First().Value;

            return context.Notes.Where(n => n.UserId == userId);
        }
    }
}
