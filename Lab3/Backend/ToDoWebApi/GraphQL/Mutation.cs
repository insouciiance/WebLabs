using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
        public async Task<LoginUserPayload> Register(
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
                throw new Exception($"There was a problem with authenticating {input.UserName}.");
            }

            await signInManager.SignInAsync(user, false);

            string jwtToken = tokenCreator.Create(user);
            DateTime expires = DateTime.Now.AddHours(1);

            return new LoginUserPayload(user, jwtToken, expires);
        }

        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<LoginUserPayload> Login(
            LoginUserInput input,
            [Service] SignInManager<ApplicationUser> signInManager,
            [Service] JwtTokenCreator tokenCreator,
            [ScopedService] ToDosDbContext context)
        {
            string userName = input.UserName;
            ApplicationUser user = context.Users.FirstOrDefault(u => u.UserName == userName);

            if (user is null)
            {
                throw new Exception("The specified username was incorrect.");
            }

            SignInResult result = await signInManager.PasswordSignInAsync(user, input.Password, false, false);

            if (!result.Succeeded)
            {
                throw new Exception("The specified password was incorrect.");
            }

            string jwtToken = tokenCreator.Create(user);
            DateTime expires = DateTime.Now.AddHours(1);

            return new LoginUserPayload(user, jwtToken, expires);
        }

        [Authorize]
        public async Task<LogoutUserPayload> Logout(
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
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoNotePayload> AddNote(
            ToDoNoteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;
            ToDoNote newNote = new()
            {
                Id = Guid.NewGuid().ToString(),
                Name = input.Name,
                UserId = userId,
                DateCreated = DateTime.Now
            };

            context.Notes.Add(newNote);

            await context.SaveChangesAsync();

            return new ToDoNotePayload(newNote);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoNotePutPayload> PutNote(
            ToDoNotePutInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoNote noteToPut = context.Notes.FirstOrDefault(n => n.Id == input.Id);

            if (noteToPut is null || noteToPut.UserId != userId)
            {
                return null;
            }

            noteToPut.Name = input.Name;

            await context.SaveChangesAsync();

            return new ToDoNotePutPayload(noteToPut);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoNoteDeletePayload> DeleteNote(
            ToDoNoteDeleteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoNote noteToDelete = context.Notes.FirstOrDefault(n => n.Id == input.Id);

            if (noteToDelete is null || noteToDelete.UserId != userId)
            {
                return new ToDoNoteDeletePayload(false);
            }

            context.Notes.Remove(noteToDelete);

            await context.SaveChangesAsync();

            return new ToDoNoteDeletePayload(true);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxPayload> AddCheckbox(
            ToDoCheckboxInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context)
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

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxPutPayload> PutCheckbox(
            ToDoCheckboxPutInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoCheckbox checkboxToPut = context.Checkboxes.FirstOrDefault(c => c.Id == input.Id);

            if (checkboxToPut is null)
            {
                return null;
            }

            await context.Entry(checkboxToPut).Navigation("Note").LoadAsync();

            if (checkboxToPut.Note.UserId != userId)
            {
                return null;
            }

            checkboxToPut.Text = input.Text;

            await context.SaveChangesAsync();

            return new ToDoCheckboxPutPayload(checkboxToPut);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxDeletePayload> DeleteCheckbox(
            ToDoCheckboxDeleteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context)
        {
            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoCheckbox checkboxToDelete = context.Checkboxes.FirstOrDefault(c => c.Id == input.Id);

            if (checkboxToDelete is null)
            {
                return new ToDoCheckboxDeletePayload(false);
            }

            await context.Entry(checkboxToDelete).Navigation("Note").LoadAsync();

            if (checkboxToDelete.Note.UserId != userId)
            {
                return new ToDoCheckboxDeletePayload(false);
            }

            context.Checkboxes.Remove(checkboxToDelete);

            await context.SaveChangesAsync();

            return new ToDoCheckboxDeletePayload(true);
        }
    }
}
