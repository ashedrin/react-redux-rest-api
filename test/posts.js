export const post1 = {
  id: 1,
  title: 'Post 1',
  content: 'Content of post 1'
}

export const post2 = {
  id: 2,
  title: 'Post 2',
  content: 'Content of post 2'
}

export const post3 = {
  id: 3,
  title: 'Post 3',
  content: 'Content of post 3'
}

export const posts = {
  [post1.id]: post1,
  [post2.id]: post2,
  [post3.id]: post3,
}

export const shortList = {
  [post1.id]: post1,
  [post2.id]: post2
}
