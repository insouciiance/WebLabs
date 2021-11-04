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
using ToDoWebApi.Services.Extensions;
using ToDoWebApi.Services.Validators;

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
            RegisterUserInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);
            
            ApplicationUser user = new()
            {
                UserName = input.UserName,
                Email = input.Email
            };

            IdentityResult result = await userManager.CreateAsync(user, input.Password);

            if (!result.Succeeded)
            {
                throw new GraphQLException(ErrorMessages.CantCreateUser);
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
            LoginUserInputValidator validator = new ();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userName = input.UserName;
            ApplicationUser user = context.Users.FirstOrDefault(u => u.UserName == userName);

            SignInResult result = await signInManager.PasswordSignInAsync(user, input.Password, false, false);

            if (!result.Succeeded)
            {
                throw new GraphQLException(ErrorMessages.InvalidCredentials);
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
            ToDoNoteInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

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
            ToDoNotePutInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoNote noteToPut = context.Notes.FirstOrDefault(n => n.Id == input.Id);

            if (noteToPut is null || noteToPut.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantUpdateNote);
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
            ToDoNoteDeleteInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoNote noteToDelete = context.Notes.FirstOrDefault(n => n.Id == input.Id);

            if (noteToDelete is null || noteToDelete.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantDeleteNote);
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
            ToDoCheckboxInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;
            ToDoNote checkboxNote = context.Notes.FirstOrDefault(n => n.Id == input.NoteId);

            if (checkboxNote is null || checkboxNote.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantAddCheckbox);
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
            ToDoCheckboxPutInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoCheckbox checkboxToPut = context.Checkboxes.FirstOrDefault(c => c.Id == input.Id);

            if (checkboxToPut is null)
            {
                throw new GraphQLException(ErrorMessages.CantUpdateCheckbox);
            }

            await context.Entry(checkboxToPut).Navigation("Note").LoadAsync();

            if (checkboxToPut.Note.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantUpdateCheckbox);
            }

            checkboxToPut.Text = input.Text;
            checkboxToPut.Checked = input.Checked;

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
            ToDoCheckboxDeleteInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoCheckbox checkboxToDelete = context.Checkboxes.FirstOrDefault(c => c.Id == input.Id);

            if (checkboxToDelete is null)
            {
                throw new GraphQLException(ErrorMessages.CantDeleteCheckbox);
            }

            await context.Entry(checkboxToDelete).Navigation("Note").LoadAsync();

            if (checkboxToDelete.Note.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantDeleteCheckbox);
            }

            context.Checkboxes.Remove(checkboxToDelete);

            await context.SaveChangesAsync();

            return new ToDoCheckboxDeletePayload(true);
        }
    }
}
