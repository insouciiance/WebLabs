using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using ToDoWebApi.Data.DbContexts;
using ToDoWebApi.GraphQL.ToDos;
using ToDoWebApi.GraphQL.Users;
using ToDoWebApi.Models;
using ToDoWebApi.Services;

namespace ToDoWebApi.GraphQL
{
    [GraphQLDescription("Represents the mutation operating on authentication of users.")]
    public class Mutation
    {
        public async Task<LoginUserPayload> RegisterAsync(
            RegisterUserInput input,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] SignInManager<ApplicationUser> signInManager,
            [Service] JwtTokenCreator tokenCreator)
        {
            ApplicationUser user = new()
            {
                UserName = input.UserName,
                Email = input.Email
            };

            IdentityResult result = await userManager.CreateAsync(user, input.Password);

            if (!result.Succeeded)
            {
                return null;
            }

            await signInManager.SignInAsync(user, false);

            string jwtToken = tokenCreator.Create(user);
            return new LoginUserPayload(user.UserName, user.Email, jwtToken);
        }

        [Authorize]
        public async Task<ToDoNotePayload> AddNote(
            ToDoNoteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext.User.Claims.First().Value;
            ToDoNote newNote = new()
            {
                Id = Guid.NewGuid().ToString(),
                Name = input.Name,
                UserId = userId
            };

            context.Notes.Add(newNote);

            await context.SaveChangesAsync();

            return new ToDoNotePayload(newNote);
        }
    }
}
