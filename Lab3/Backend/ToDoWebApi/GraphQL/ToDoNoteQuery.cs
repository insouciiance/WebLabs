using System;
using System.Collections.Generic;
using System.Linq;
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
    [GraphQLDescription("Represents user to-do notes.")]
    [ExtendObjectType("Query")]
    public class ToDoNoteQuery
    {
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
