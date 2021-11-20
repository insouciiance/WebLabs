using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;

namespace ToDoWebApi.GraphQL.ErrorFilters
{
    public class GraphQLErrorFilter : IErrorFilter
    {
        public IError OnError(IError error)
        {
            if (error.Exception is not null and not GraphQLException)
            {
                return error.WithMessage("There was an error while processing the request.");
            }

            return error;
        }
    }
}
