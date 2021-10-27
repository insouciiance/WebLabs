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

        public async Task<LoginUserPayload> LoginAsync(
            LoginUserInput input,
            [Service] SignInManager<ApplicationUser> signInManager,
            [Service] JwtTokenCreator tokenCreator,
            [Service] ToDosDbContext context)
        {
            string userName = input.UserName;
            ApplicationUser user = context.Users.FirstOrDefault(u => u.UserName == userName);

            if (user is null)
            {
                return null;
            }

            SignInResult result = await signInManager.PasswordSignInAsync(user, input.Password, false, false);

            if (!result.Succeeded)
            {
                return null;
            }

            string jwtToken = tokenCreator.Create(user);

            return new LoginUserPayload(user.UserName, user.Email, jwtToken);
        }

        [Authorize]
        public async Task<LogoutUserPayload> LogoutAsync(
            [Service] SignInManager<ApplicationUser> signInManager)
        {
            try
            {
                await signInManager.SignOutAsync();
            }
            catch
            {
                return new LogoutUserPayload(false);
            }

            return new LogoutUserPayload(true);
        }

        [Authorize]
        public async Task<ToDoNotePayload> AddNote(
            ToDoNoteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;
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

        [Authorize]
        public async Task<ToDoCheckboxPayload> AddCheckbox(
            ToDoCheckboxInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;
            ToDoNote checkboxNote = context.Notes.FirstOrDefault(n => n.Id == input.NoteId);

            if (checkboxNote is null || checkboxNote.UserId != userId)
            {
                return null;
            }

            ToDoCheckbox checkbox = new()
            {
                Id = Guid.NewGuid().ToString(),
                NoteId = checkboxNote.Id,
                Text = input.Text,
                Checked = false
            };

            context.Checkboxes.Add(checkbox);

            await context.SaveChangesAsync();

            return new ToDoCheckboxPayload(checkbox);
        }
    }
}
