from volcenginesdkarkruntime import Ark

client = Ark(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
)

# # Non-streaming:
# print("----- standard request -----")
# completion = client.chat.completions.create(
#     model="ep-20241006203158-pxgnt",
#     messages = [
#         {"role": "system", "content": "你是豆包，是由字节跳动开发的 AI 人工智能助手"},
#         {"role": "user", "content": "常见的十字花科植物有哪些？"},
#     ],
# )
# print(completion.choices[0].message.content)

# Streaming:
print("----- streaming request -----")
completion = client.chat.completions.create(
    model="ep-20241006203158-pxgnt",
    messages = [
        {"role": "system", "content": "你是周易大师，精通八卦算命和八字排盘"},
        {"role": "user", "content": "公历1989年3月18日凌晨2点生男，根据这个生日排盘，然后打分，仅返回 json 格式的数据"},
    ]
)
# for chunk in stream:
#     if not chunk.choices:
#         continue
#     print(chunk.choices[0].delta.content, end="")
# print()

print(completion.choices[0].message.content)