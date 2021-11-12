using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
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
    [ExtendObjectType("Mutation")]
    public class UserMutation
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
    }
}
