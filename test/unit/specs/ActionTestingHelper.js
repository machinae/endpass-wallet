export default (action, payload, context, expectedMutations, expectedActions) => {
  let musationsCount = 0
  let actionsCount = 0

  const commit = (type, payload) => {
    const mutation = expectedMutations[musationsCount]
    expect(type).toBe(mutation.type)
    musationsCount++
  }

  const dispatch = (type, payload) => {
    const action = expectedActions[actionsCount]
    expect(type).toBe(action.type)
    actionsCount++
    if(expectedActions[actionsCount].async) {
      return new Promise ((res,rej) => {
        res();
      })
    }
  }

  context.commit = commit
  context.dispatch = dispatch
  let res = action(context, payload)
  if(res instanceof Promise) {
    res.then(()=>{
      setTimeout(() => {
        expect(musationsCount).toBe(expectedMutations.length)
        expect(actionsCount).toBe(expectedActions.length)
      }, 500);
    });
  } else {
    expect(musationsCount).toBe(expectedMutations.length)
    expect(actionsCount).toBe(expectedActions.length)
  }
}