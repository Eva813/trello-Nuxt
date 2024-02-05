import bcrypt from "bcryptjs";
//https://andy6804tw.github.io/2018/01/08/user-bcrypt/  
//將一個字串做雜湊加密
//saltRounds 是在密碼學中的加鹽(salt)，加鹽的意思是在要加密的字串中加特定的字符，打亂原始的字符串，使其生成的散列結果產生變化，其參數越高加鹽次數多越安全相對的加密時間就越長。
export async function generateHash(data: string, saltRound: number = 10) {
  const salt = await bcrypt.genSalt(saltRound);
  const hashedData = await bcrypt.hash(data, salt);

  return hashedData;
}
