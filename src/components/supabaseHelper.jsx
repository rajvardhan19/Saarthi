import supabase from "./supabaseClient";

export const markAsHeard = async (userId, chapterId) => {
  const { data: recentHeardData, error: recentHeardError } = await supabase
    .from("recently_heard")
    .select("*")
    .eq("user_id", userId)
    .order("last_heard", { ascending: false })
    .limit(1);

  if (recentHeardError) {
    console.error("Error checking recently heard:", recentHeardError);
    return;
  }

  if (
    recentHeardData.length > 0 &&
    recentHeardData[0].chapter_id === chapterId
  ) {
    return;
  }

  const { data, error } = await supabase
    .from("recently_heard")
    .select("*")
    .eq("user_id", userId)
    .eq("chapter_id", chapterId);

  if (error) {
    console.error("Error checking recently heard:", error);
    return;
  }

  if (data.length === 0) {
    const { error: insertError } = await supabase
      .from("recently_heard")
      .insert([{ user_id: userId, chapter_id: chapterId }]);

    if (insertError) {
      console.error("Error marking as heard:", insertError);
    }
  } else {
    const { error: updateError } = await supabase
      .from("recently_heard")
      .update({ last_heard: new Date() })
      .eq("user_id", userId)
      .eq("chapter_id", chapterId);

    if (updateError) {
      console.error("Error updating recently heard:", updateError);
    }
  }
};

export const markAsRead = async (userId, chapterId) => {
  const { data: recentReadData, error: recentReadError } = await supabase
    .from("recently_read")
    .select("*")
    .eq("user_id", userId)
    .order("last_read", { ascending: false })
    .limit(1);

  if (recentReadError) {
    console.error("Error checking recently read:", recentReadError);
    return;
  }

  if (recentReadData.length > 0 && recentReadData[0].chapter_id === chapterId) {
    return;
  }

  const { data, error } = await supabase
    .from("recently_read")
    .select("*")
    .eq("user_id", userId)
    .eq("chapter_id", chapterId);

  if (error) {
    console.error("Error checking recently read:", error);
    return;
  }

  if (data.length === 0) {
    const { error: insertError } = await supabase
      .from("recently_read")
      .insert([{ user_id: userId, chapter_id: chapterId }]);

    if (insertError) {
      console.error("Error marking as read:", insertError);
    }
  } else {
    const { error: updateError } = await supabase
      .from("recently_read")
      .update({ last_read: new Date() })
      .eq("user_id", userId)
      .eq("chapter_id", chapterId);

    if (updateError) {
      console.error("Error updating recently read:", updateError);
    }
  }
};
