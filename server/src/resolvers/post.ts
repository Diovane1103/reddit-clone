import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/auth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";

@InputType()
class PostInput {
  @Field()
  title!: string;

  @Field()
  text!: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('value', () => Int) value: number,
    @Arg('postId', () => Int) postId: number,
    @Ctx() { req }: MyContext
  ) {
    const realValue = value !== -1 ? 1 : -1 
    const { userId } = req.session;

    const updoot = await Updoot.findOne({ where: { postId, userId } })
    if(updoot && updoot.value !== realValue) {
      await getConnection().transaction(async tm => {
        await tm.query(
          `
            UPDATE updoot
            SET value = $3
            WHERE "userId" = $1 
            AND "postId" = $2
          `, 
          [userId, postId, realValue])

        await tm.query(
          `
            UPDATE post
            SET points = points + $2
            WHERE id = $1
          `, 
          [userId, 2 * realValue])
      })
    } else if (!updoot) {
      await getConnection().transaction(async tm => {
        await tm.query(
        `
          INSERT INTO updoot ("userId", "postId", value) 
          VALUES ($1, $2, $3);
        `, 
        [userId, postId, realValue])

        await tm.query(
        `
          UPDATE post
          SET points = points + $2
          WHERE id = $1
        `, 
        [userId, realValue])
      })
    }
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      ` select p.*,
          json_build_object(
            'id', u.id,
            'username', u.username,
            'email', u.email
          ) creator
          from post p
          inner join public.user u on p."creatorId" = u.id
          ${cursor ? `where p."createdAt" < $2` : ""}
          order by p."createdAt" DESC
          limit $1
        `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("id") id: number
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(@Arg("id") id: number): Promise<Boolean> {
    await Post.delete(id);
    return true;
  }
}
