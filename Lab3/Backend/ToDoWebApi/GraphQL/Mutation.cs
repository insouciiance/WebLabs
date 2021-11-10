using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Subscriptions;
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

            if (userManager.Users.Any(u => u.UserName == input.UserName || u.Email == input.Email))
            {
                throw new GraphQLException(ErrorMessages.UserExists);
            }

            IdentityResult result = await userManager.CreateAsync(user, input.Password);

            if (!result.Succeeded)
            {
                throw new GraphQLException(ErrorMessages.CantCreateUser);
            }

            await signInManager.SignInAsync(user, false);

            string jwtToken = tokenCreator.Create(user);
            DateTime expires = DateTime.Now.AddHours(1);

            LoginUserPayload payload = new(user, jwtToken, expires);

            return payload;
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

            if (user is null)
            {
                throw new GraphQLException(ErrorMessages.InvalidCredentials);
            }

            SignInResult result = await signInManager.PasswordSignInAsync(user, input.Password, false, false);

            if (!result.Succeeded)
            {
                throw new GraphQLException(ErrorMessages.InvalidCredentials);
            }

            string jwtToken = tokenCreator.Create(user);
            DateTime expires = DateTime.Now.AddHours(1);

            LoginUserPayload payload = new(user, jwtToken, expires);

            return payload;
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
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
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

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoNotePayload(newNote);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoNotePutPayload> PutNote(
            ToDoNotePutInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
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

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoNotePutPayload(noteToPut);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoNoteDeletePayload> DeleteNote(
            ToDoNoteDeleteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
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

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoNoteDeletePayload(true);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxPayload> AddCheckbox(
            ToDoCheckboxInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
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

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoCheckboxPayload(checkbox);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxPutPayload> PutCheckbox(
            ToDoCheckboxPutInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            ToDoCheckboxPutInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoCheckbox checkboxToPut = context.Checkboxes.FirstOrDefault(c => c.Id == input.Id);

            if (checkboxToPut is null)
            {
                throw new GraphQLException(ErrorMessages.CantUpdateCheckbox);
            }

            await context.Entry(checkboxToPut).Navigation("Note").LoadAsync(cancellationToken);

            if (checkboxToPut.Note.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantUpdateCheckbox);
            }

            checkboxToPut.Text = input.Text;
            checkboxToPut.Checked = input.Checked;

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoCheckboxPutPayload(checkboxToPut);
        }

        [Authorize]
        [UseDbContext(typeof(ToDosDbContext))]
        public async Task<ToDoCheckboxDeletePayload> DeleteCheckbox(
            ToDoCheckboxDeleteInput input,
            [Service] IHttpContextAccessor contextAccessor,
            [ScopedService] ToDosDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            ToDoCheckboxDeleteInputValidator validator = new();
            await validator.ValidateAndThrowGraphQLExceptionAsync(input);

            string userId = contextAccessor.HttpContext!.User.Claims.First().Value;

            ToDoCheckbox checkboxToDelete = context.Checkboxes.FirstOrDefault(c => c.Id == input.Id);

            if (checkboxToDelete is null)
            {
                throw new GraphQLException(ErrorMessages.CantDeleteCheckbox);
            }

            await context.Entry(checkboxToDelete).Navigation("Note").LoadAsync(cancellationToken);

            if (checkboxToDelete.Note.UserId != userId)
            {
                throw new GraphQLException(ErrorMessages.CantDeleteCheckbox);
            }

            context.Checkboxes.Remove(checkboxToDelete);

            await context.SaveChangesAsync(cancellationToken);

            await SubscriptionMessageEmitter.EmitOnNotesUpdate(
                contextAccessor,
                context,
                eventSender,
                cancellationToken);

            return new ToDoCheckboxDeletePayload(true);
        }
    }
}
